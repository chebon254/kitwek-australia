import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendTicketEmail } from '@/lib/nodemailer';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    try {
      // Get the metadata from the session
      const { type } = session.metadata as { type: 'membership' | 'subscription' | 'ticket' };

      if (type === 'membership') {
        // Handle membership payment
        await prisma.user.update({
          where: { stripeCustomerId: session.customer as string },
          data: {
            membershipStatus: 'ACTIVE',
          },
        });
      } else if (type === 'subscription') {
        // Handle subscription payment
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        await prisma.user.update({
          where: { stripeCustomerId: session.customer as string },
          data: {
            membershipStatus: 'ACTIVE',
            subscription: subscription.items.data[0].price.nickname || 'Premium',
          },
        });
      } else if (type === 'ticket') {
        // Handle ticket purchase
        const { eventId, quantity, attendees: attendeesJson } = session.metadata as {
          eventId: string;
          quantity: string;
          attendees: string;
        };

        if (!eventId || !quantity || !attendeesJson) {
          throw new Error('Missing required metadata for ticket purchase');
        }

        const attendeesData = JSON.parse(attendeesJson);

        // Create ticket and update event in a transaction
        const result = await prisma.$transaction(async (prisma) => {
          // Create ticket
          const ticket = await prisma.ticket.create({
            data: {
              eventId,
              userId: session.metadata?.userId || null,
              quantity: parseInt(quantity),
              totalAmount: session.amount_total! / 100,
            },
          });

          // Create attendees
          const createdAttendees = await Promise.all(
            attendeesData.map((attendee: {
              firstName: string;
              lastName: string;
              email: string;
              phone?: string;
            }) =>
              prisma.eventAttendee.create({
                data: {
                  eventId,
                  ticketId: ticket.id,
                  firstName: attendee.firstName,
                  lastName: attendee.lastName,
                  email: attendee.email,
                  phone: attendee.phone,
                  paid: true,
                  amount: (session.amount_total! / 100) / parseInt(quantity)
                }
              })
            )
          );

          // Update remaining slots
          await prisma.event.update({
            where: { id: eventId },
            data: { remainingSlots: { decrement: parseInt(quantity) } },
          });

          // Get event details for email
          const event = await prisma.event.findUnique({
            where: { id: eventId },
          });

          return {
            ticket,
            attendees: createdAttendees,
            event,
          };
        });

        // Send ticket emails to all attendees
        for (const attendee of result.attendees) {
          await sendTicketEmail(
            attendee.email,
            attendee.firstName,
            result.event!,
            result.ticket.id
          );
        }
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}