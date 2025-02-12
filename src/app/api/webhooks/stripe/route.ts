import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendPaymentConfirmation } from '@/lib/mail';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature') as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      
      // Update user membership status
      const user = await prisma.user.update({
        where: { email: session.customer_email },
        data: { 
          membershipStatus: 'ACTIVE',
          stripeCustomerId: session.customer
        },
      });

      // Send confirmation email
      await sendPaymentConfirmation(user.email, user.name);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}