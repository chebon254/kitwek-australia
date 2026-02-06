import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
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

    // Check welfare registration status
    const registration = await prisma.welfareRegistration.findUnique({
      where: { userId: user.id }
    });

    const isActiveMember = registration?.status === 'ACTIVE' &&
                          registration?.paymentStatus === 'PAID';

    // Find any pending reimbursements
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
            claimAmount: true,
            applicationType: true
          }
        }
      }
    });

    return NextResponse.json({
      isEligible: isActiveMember && !!pendingReimbursement,
      isActiveMember,
      hasPendingReimbursement: !!pendingReimbursement,
      reimbursement: pendingReimbursement ? {
        id: pendingReimbursement.id,
        amountDue: pendingReimbursement.amountDue,
        dueDate: pendingReimbursement.dueDate,
        applicationName: pendingReimbursement.application.deceasedName,
        applicationType: pendingReimbursement.application.applicationType,
        claimAmount: pendingReimbursement.application.claimAmount
      } : null
    });
  } catch (error) {
    console.error('Eligibility check error:', error);
    return NextResponse.json(
      {
        error: 'Error checking eligibility',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
