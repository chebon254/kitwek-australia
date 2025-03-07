import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";


//  TEST PRICES
// const MEMBERSHIP_PRICE = "price_1QxcJN01IgH6xBSRVyVFvNqV";
// const SUBSCRIPTION_PRICES = {
//   Premium: {
//     monthly: "price_1QySd004YgkEMOrN7RDLQ4Mr", 
//     annual: "price_1QxcIO01IgH6xBSRqv8oFNOa", 
//   },
//   VIP: {
//     monthly: "price_1QySd004YgkEMOrN7RDLQ4Mr", 
//     annual: "price_1QxcGm01IgH6xBSRi6o1VaHV",
// } as const;

// Live Fixed price IDs for membership and subscriptions
const MEMBERSHIP_PRICE = "price_1R08B404YgkEMOrNZkrYhBJV"; 
const SUBSCRIPTION_PRICES = {
  Premium: {
    monthly: "price_1QySd004YgkEMOrN7RDLQ4Mr", 
    annual: "price_1R08CZ04YgkEMOrNZl85jAAC", 
  },
  VIP: {
    monthly: "price_1QySd004YgkEMOrN7RDLQ4Mr", 
    annual: "price_1R08Dr04YgkEMOrNA4958WVv", 
  },
} as const;

type PlanName = keyof typeof SUBSCRIPTION_PRICES;
type BillingCycle = keyof (typeof SUBSCRIPTION_PRICES)[PlanName];

export async function POST(request: Request) {
  try {
    const {
      type,
      planName,
      billingCycle,
      donationId,
      name,
      email,
      amount,
      message,
      anonymous,
    } = await request.json();

    // Validate required fields
    if (!type) {
      return NextResponse.json(
        { error: "Missing request type" },
        { status: 400 }
      );
    }

    // For donations, we don't require authentication
    if (type === "donation") {
      if (!donationId || !name || !email || !amount) {
        return NextResponse.json(
          { error: "Missing required donation fields" },
          { status: 400 }
        );
      }

      const donation = await prisma.donation.findUnique({
        where: { id: donationId },
      });

      if (!donation) {
        return NextResponse.json(
          { error: "Donation not found" },
          { status: 404 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: donation.name,
                description: "One-time donation",
              },
              unit_amount: amount * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/donations/${donationId}/thank-you?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/donations/${donationId}?canceled=true`,
        customer_email: email,
        metadata: {
          type: "donation",
          donationId,
          name,
          email,
          message,
          anonymous: String(anonymous),
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // For other types (membership, subscription), require authentication
    const session = (await cookies()).get("session");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(
      session.value,
      true
    );
    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    try {
      if (!stripeCustomerId) {
        // Create new customer if no Stripe ID exists
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
            origin: "initial_creation",
          },
        });
        stripeCustomerId = customer.id;
      } else {
        // Verify existing customer
        try {
          await stripe.customers.retrieve(stripeCustomerId);
        } catch (customerRetrieveError) {
          // If customer not found, create a new one
          console.warn(
            "Existing Stripe customer not found, creating new customer: ", customerRetrieveError
          );
          const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
              userId: user.id,
              origin: "customer_recovery",
            },
          });
          stripeCustomerId = customer.id;
        }
      }

      // Always update user with the verified/new customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    } catch (error) {
      console.error("Stripe customer creation/verification failed:", error);
      return NextResponse.json(
        {
          error: "Failed to create or verify Stripe customer",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // Handle membership activation
    if (type === "membership") {
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price: MEMBERSHIP_PRICE,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/membership?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/membership?canceled=true`,
        metadata: {
          userId: user.id,
          type: "membership",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Handle subscription
    if (type === "subscription") {
      if (!planName || !billingCycle) {
        return NextResponse.json(
          { error: "Missing plan name or billing cycle" },
          { status: 400 }
        );
      }

      const priceId =
        SUBSCRIPTION_PRICES[planName as PlanName]?.[
          billingCycle as BillingCycle
        ];
      if (!priceId) {
        return NextResponse.json(
          { error: "Invalid plan or billing cycle" },
          { status: 400 }
        );
      }

      // Check if user already has an active subscription
      const existingSubscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: "active",
      });

      // Cancel existing subscriptions if switching plans
      if (existingSubscriptions.data.length > 0) {
        for (const subscription of existingSubscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id);
        }

        // Update user record to Free before creating new subscription
        await prisma.user.update({
          where: { id: user.id },
          data: { subscription: "Free" },
        });
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/subscription?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/subscription?canceled=true`,
        metadata: {
          userId: user.id,
          planName,
          billingCycle,
          type: "subscription",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
