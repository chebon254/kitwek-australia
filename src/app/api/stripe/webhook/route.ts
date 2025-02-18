import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    try {
      // Get the metadata from the session
      const { type } = session.metadata as { type: 'membership' | 'subscription' };

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
