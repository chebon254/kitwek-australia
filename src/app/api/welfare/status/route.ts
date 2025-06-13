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

    // Get welfare applications
    const applications = await prisma.welfareApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Get pending reimbursements
    const reimbursements = await prisma.welfareReimbursement.findMany({
      where: { userId: user.id },
      orderBy: { dueDate: 'asc' }
    });

    // Check if user can apply (must be active member with paid registration)
    const canApply = registration?.status === 'ACTIVE' && registration?.paymentStatus === 'PAID';

    // Get welfare fund status to check waiting period
    const welfareStats = await prisma.welfareFund.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Check if waiting period has passed
    const waitingPeriodPassed = welfareStats?.waitingPeriodEnd ? 
      new Date() > new Date(welfareStats.waitingPeriodEnd) : false;

    return NextResponse.json({
      isRegistered: !!registration,
      paymentStatus: registration?.paymentStatus || 'PENDING',
      registrationDate: registration?.registrationDate,
      status: registration?.status || 'INACTIVE',
      canApply: canApply && waitingPeriodPassed && welfareStats?.isOperational,
      applications: applications.map(app => ({
        id: app.id,
        applicationType: app.applicationType,
        deceasedName: app.deceasedName,
        status: app.status,
        claimAmount: app.claimAmount,
        createdAt: app.createdAt,
        approvedAt: app.approvedAt,
        payoutDate: app.payoutDate,
      })),
      reimbursements: reimbursements.map(reimb => ({
        id: reimb.id,
        amountDue: reimb.amountDue,
        amountPaid: reimb.amountPaid,
        dueDate: reimb.dueDate,
        status: reimb.status,
        applicationId: reimb.applicationId,
      })),
    });
  } catch (error) {
    console.error('Error fetching welfare status:', error);
    return NextResponse.json(
      { error: 'Error fetching welfare status' },
      { status: 500 }
    );
  }
}