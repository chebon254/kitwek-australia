import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendTicketEmail } from "@/lib/nodemailer";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    try {
      const { type } = session.metadata as {
        type: "membership" | "subscription" | "ticket";
      };

      if (type === "membership") {
        await prisma.user.update({
          where: { stripeCustomerId: session.customer as string },
          data: { membershipStatus: "ACTIVE" },
        });
      } else if (type === "subscription") {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await prisma.user.update({
          where: { stripeCustomerId: session.customer as string },
          data: {
            membershipStatus: "ACTIVE",
            subscription:
              subscription.items.data[0].price.nickname || "Premium",
          },
        });
      } else if (type === "ticket") {
        const metadata = session.metadata as {
          eventId: string;
          quantity: string;
          attendees: string;
          userId?: string;
        };

        if (!metadata.eventId || !metadata.quantity || !metadata.attendees) {
          throw new Error("Missing required metadata for ticket purchase");
        }

        const attendeesData = JSON.parse(metadata.attendees);
        const quantity = parseInt(metadata.quantity);
        const amountPerTicket = (session.amount_total || 0) / 100 / quantity;

        const result = await prisma.$transaction(async (tx) => {
          // First check if event exists and has enough slots
          const event = await tx.event.findUnique({
            where: { id: metadata.eventId },
          });

          if (!event) {
            throw new Error("Event not found");
          }

          if (event.remainingSlots < quantity) {
            throw new Error("Not enough remaining slots");
          }

          // Create the ticket
          const ticket = await tx.ticket.create({
            data: {
              eventId: metadata.eventId,
              userId: metadata.userId,
              quantity,
              totalAmount: (session.amount_total || 0) / 100,
              status: "ACTIVE",
            },
          });

          // Create attendees
          const attendees = await Promise.all(
            attendeesData.map(
              (attendee: {
                firstName: string;
                lastName: string;
                email: string;
                phone?: string;
              }) =>
                tx.eventAttendee.create({
                  data: {
                    eventId: metadata.eventId,
                    ticketId: ticket.id,
                    firstName: attendee.firstName,
                    lastName: attendee.lastName,
                    email: attendee.email,
                    phone: attendee.phone,
                    paid: true,
                    amount: amountPerTicket,
                  },
                })
            )
          );

          // Update event slots
          await tx.event.update({
            where: { id: metadata.eventId },
            data: { remainingSlots: { decrement: quantity } },
          });

          return { ticket, attendees, event };
        });

        // Send confirmation emails
        await Promise.all(
          result.attendees.map((attendee) =>
            sendTicketEmail(
              attendee.email,
              attendee.firstName,
              result.event,
              result.ticket.id
            )
          )
        );
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Error processing webhook",
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
