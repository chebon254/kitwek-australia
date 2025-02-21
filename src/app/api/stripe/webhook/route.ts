import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`✅ Webhook event received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Find user by Stripe Customer ID
        const customer = session.customer as string;
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customer }
        });

        if (!user) {
          console.error('User not found for customer:', customer);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (session.metadata?.type === 'membership') {
          // Update membership status
          await prisma.user.update({
            where: { id: user.id },
            data: { membershipStatus: 'ACTIVE' }
          });
          console.log('Membership activated for user:', user.id);
        } 
        else if (session.metadata?.type === 'subscription') {
          // Update subscription plan
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              subscription: session.metadata.planName || 'Premium',
              membershipStatus: 'ACTIVE'
            }
          });
          console.log('Subscription updated for user:', user.id);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = subscription.customer as string;
        
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customer }
        });

        if (user) {
          // Get the plan name from the subscription
          const planName = subscription.items.data[0]?.price?.nickname || 'Premium';
          
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscription: subscription.status === 'active' ? planName : 'Free',
              membershipStatus: subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE'
            }
          });
          console.log('Subscription status updated for user:', user.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = subscription.customer as string;
        
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customer }
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              subscription: 'Free',
              membershipStatus: 'INACTIVE'
            }
          });
          console.log('Subscription cancelled for user:', user.id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};