import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { STRIPE_CONFIG } from "@/lib/stripe-config";

export async function POST(request: Request) {
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

    // Check if user is an active welfare member
    const registration = await prisma.welfareRegistration.findUnique({
      where: { userId: user.id }
    });

    if (!registration || registration.status !== 'ACTIVE' || registration.paymentStatus !== 'PAID') {
      return NextResponse.json({
        error: 'Must be an active welfare member to pay reimbursements'
      }, { status: 403 });
    }

    // Find the oldest pending reimbursement for this user
    const pendingReimbursement = await prisma.welfareReimbursement.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING'
      },
      orderBy: { dueDate: 'asc' },
      include: {
        application: {
          select: {
            deceasedName: true,
            claimAmount: true
          }
        }
      }
    });

    if (!pendingReimbursement) {
      return NextResponse.json({
        error: 'No pending reimbursements found'
      }, { status: 404 });
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username || undefined,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Create Stripe checkout session for AUD $19
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
              name: STRIPE_CONFIG.products.welfare_reimbursement.name,
              description: `Reimbursement for ${pendingReimbursement.application.deceasedName} welfare payout`,
            },
            unit_amount: 1900, // $19.00 in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/welfare?reimbursement_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/welfare?reimbursement_canceled=true`,
      metadata: {
        type: "welfare_reimbursement",
        userId: user.id,
        reimbursementId: pendingReimbursement.id,
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      reimbursement: {
        id: pendingReimbursement.id,
        amount: pendingReimbursement.amountDue,
        dueDate: pendingReimbursement.dueDate,
        applicationName: pendingReimbursement.application.deceasedName
      }
    });
  } catch (error) {
    console.error('Reimbursement payment error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create payment session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
