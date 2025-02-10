import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer;
    
    if (!customer.email) {
      return new NextResponse("Customer email not found", { status: 400 });
    }
    
    // Update user membership status
    await prisma.user.update({
      where: {
        email: customer.email,
      },
      data: {
        membershipStatus: "ACTIVE",
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}