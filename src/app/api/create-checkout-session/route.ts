import { NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const session = await createStripeCheckoutSession(email);
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}