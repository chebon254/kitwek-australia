import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

// You'll need to create this price ID in Stripe for $200 welfare registration
// const WELFARE_REGISTRATION_PRICE = "price_welfare_registration_200"; // Replace with actual Stripe price ID

export async function POST() {
  try {
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

    // Check if user is already registered
    const existingRegistration = await prisma.welfareRegistration.findUnique({
      where: { userId: user.id }
    });

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for welfare' }, { status: 400 });
    }

    // Create welfare registration record
    const registration = await prisma.welfareRegistration.create({
      data: {
        userId: user.id,
        registrationFee: 200.00,
        paymentStatus: 'PENDING',
        status: 'INACTIVE',
      }
    });

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

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Kitwek Victoria Welfare Registration',
              description: 'One-time welfare fund registration fee',
            },
            unit_amount: 20000, // $200.00 in cents
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

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating welfare registration:', error);
    return NextResponse.json(
      { error: 'Error creating welfare registration' },
      { status: 500 }
    );
  }
}