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
};

export async function POST(request: Request) {
  try {
    const session = (await cookies()).get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    if (!decodedClaims.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { type, planName, billingCycle } = await request.json();

    // Handle membership activation payment
    if (type === 'membership') {
      try {
        // Create a customer if one doesn't exist
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

        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price: MEMBERSHIP_PRICE,
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/membership?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/membership?canceled=true`,
          metadata: {
            userId: user.id,
            type: 'membership',
          },
        });

        return NextResponse.json({ url: session.url });
      } catch (stripeError) {
        console.error('Membership payment setup error:', stripeError);
        return NextResponse.json(
          { error: 'Failed to set up membership payment' },
          { status: 500 }
        );
      }
    }

    // Handle subscription
    if (type === 'subscription') {
      try {
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

        const priceId = SUBSCRIPTION_PRICES[planName as keyof typeof SUBSCRIPTION_PRICES]?.[billingCycle as 'monthly' | 'annual'];
        if (!priceId) {
          return NextResponse.json({ error: 'Invalid plan or billing cycle' }, { status: 400 });
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
      } catch (stripeError) {
        console.error('Subscription setup error:', stripeError);
        return NextResponse.json(
          { error: 'Failed to set up subscription' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}