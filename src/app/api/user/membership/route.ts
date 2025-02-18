export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export async function GET() {
  try {
    const session = (await cookies()).get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    const user = await prisma.user.findUnique({
      where: { email: decodedClaims.email },
      select: {
        id: true,
        membershipStatus: true,
        subscription: true,
        stripeCustomerId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let subscriptionStatus = null;
    if (user.stripeCustomerId) {
      try {
        const subscriptions = await Promise.race<Stripe.Response<Stripe.ApiList<Stripe.Subscription>>>([
          stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            limit: 1,
            status: 'active',
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Stripe request timeout')), 10000)
          ),
        ]);
        
        if (subscriptions.data.length > 0) {
          subscriptionStatus = subscriptions.data[0].status;
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        // Continue without subscription status
      }
    }

    return NextResponse.json({
      membershipStatus: user.membershipStatus,
      subscription: user.subscription,
      subscriptionStatus: subscriptionStatus || 'unknown',
    });
  } catch (error) {
    console.error('Membership status error:', error);
    return NextResponse.json(
      { error: 'Error fetching membership status' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = (await cookies()).get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    // const { paymentIntentId } = await request.json();

    const user = await prisma.user.update({
      where: { email: decodedClaims.email },
      data: {
        membershipStatus: 'ACTIVE',
      },
    });

    return NextResponse.json({ status: 'success', user });
  } catch (error) {
    console.error('Membership activation error:', error);
    return NextResponse.json(
      { error: 'Error activating membership' },
      { status: 500 }
    );
  }
}