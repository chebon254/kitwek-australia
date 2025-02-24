import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

// Fixed price IDs for membership and subscriptions
const MEMBERSHIP_PRICE = 'price_1Qtp4DGUzorFIpd8Hn5t0Ed9'; // $30 one-time payment
const SUBSCRIPTION_PRICES = {
  Premium: {
    monthly: 'price_1Qtp4jGUzorFIpd8HbTx1ZHy', // $4.99/month
    annual: 'price_1QtpbAGUzorFIpd8q15yvVaf',  // $49.99/year
  },
  VIP: {
    monthly: 'price_1Qtp5BGUzorFIpd8a6yfozQs', // $9.99/month
    annual: 'price_1QtpeIGUzorFIpd8MV3D450x',  // $99.99/year
  },
} as const;

type PlanName = keyof typeof SUBSCRIPTION_PRICES;
type BillingCycle = keyof typeof SUBSCRIPTION_PRICES[PlanName];

export async function POST(request: Request) {
  try {
    const { type, planName, billingCycle, donationId, name, email, amount, message, anonymous } = await request.json();

    // Validate required fields
    if (!type) {
      return NextResponse.json({ error: 'Missing request type' }, { status: 400 });
    }

    // For donations, we don't require authentication
    if (type === 'donation') {
      if (!donationId || !name || !email || !amount) {
        return NextResponse.json(
          { error: 'Missing required donation fields' },
          { status: 400 }
        );
      }

      const donation = await prisma.donation.findUnique({
        where: { id: donationId },
      });

      if (!donation) {
        return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: donation.name,
                description: 'One-time donation',
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
          type: 'donation',
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
    const session = (await cookies()).get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Handle membership activation
    if (type === 'membership') {
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: 'payment',
        payment_method_types: ['card'],
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
          type: 'membership',
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Handle subscription
    if (type === 'subscription') {
      if (!planName || !billingCycle) {
        return NextResponse.json(
          { error: 'Missing plan name or billing cycle' },
          { status: 400 }
        );
      }

      const priceId = SUBSCRIPTION_PRICES[planName as PlanName]?.[billingCycle as BillingCycle];
      if (!priceId) {
        return NextResponse.json(
          { error: 'Invalid plan or billing cycle' },
          { status: 400 }
        );
      }

      // Check if user already has an active subscription
      const existingSubscription = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (existingSubscription.data.length > 0) {
        return NextResponse.json(
          { error: 'You already have an active subscription' },
          { status: 400 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: 'subscription',
        payment_method_types: ['card'],
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
          type: 'subscription',
        },
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
