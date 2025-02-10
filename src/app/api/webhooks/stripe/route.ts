import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth.config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new NextResponse("No signature found", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.customer_details?.email) {
        return new NextResponse("No customer email found", { status: 400 });
      }

      // Update user membership status in the database
      await prisma.user.update({
        where: {
          email: session.customer_details.email,
        },
        data: {
          membershipStatus: "ACTIVE",
          stripeCustomerId: session.customer?.toString() || null,
        },
      });

      // Refresh the session
      const authSession = await getServerSession(authOptions);
      if (authSession?.user?.email === session.customer_details.email) {
        await authSession.update({ membershipStatus: "ACTIVE" });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse(
      `Webhook error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 }
    );
  }
}