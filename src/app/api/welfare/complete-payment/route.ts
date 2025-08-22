import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { STRIPE_CONFIG } from '@/lib/stripe-config';

export async function POST() {
  try {
    const session = (await cookies()).get('session');
    if (!session) {
      console.error('No session cookie found');
      return NextResponse.json({ error: 'Unauthorized - No session found' }, { status: 401 });
    }

    let decodedClaims;
    try {
      decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    } catch (verifyError) {
      console.error('Session verification failed:', verifyError);
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
    });

    if (!user) {
      console.error('User not found for email:', decodedClaims.email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Processing payment completion for user:', user.id, user.email);

    // Check if user has a pending registration
    const registration = await prisma.welfareRegistration.findUnique({
      where: { userId: user.id }
    });

    if (!registration) {
      return NextResponse.json({ error: 'No registration found' }, { status: 404 });
    }

    if (registration.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Payment already completed' }, { status: 400 });
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
          origin: 'welfare_registration',
        },
      });
      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Create new Stripe checkout session for pending payment
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
              name: STRIPE_CONFIG.products.welfare.name,
              description: 'Complete your welfare fund registration payment',
            },
            unit_amount: 100, // $1.00 AUD in cents (TESTING ONLY)
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/welfare?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/welfare/register?canceled=true`,
      metadata: {
        type: 'welfare_registration',
        userId: user.id,
        registrationId: registration.id,
      },
    });

    console.log('Checkout session created successfully:', checkoutSession.id);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error completing welfare payment:', error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Error completing welfare payment',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}