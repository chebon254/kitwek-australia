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

    if (!registration) {
      return NextResponse.json({
        canApply: false,
        reason: 'You must register for welfare first'
      });
    }

    if (registration.paymentStatus !== 'PAID') {
      return NextResponse.json({
        canApply: false,
        reason: 'You must complete your welfare registration payment first'
      });
    }

    if (registration.status !== 'ACTIVE') {
      return NextResponse.json({
        canApply: false,
        reason: 'Your welfare membership is not active'
      });
    }

    // Check welfare fund status
    const welfareStats = await prisma.welfareFund.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!welfareStats?.isOperational) {
      return NextResponse.json({
        canApply: false,
        reason: `Welfare fund is not yet operational. Currently ${welfareStats?.activeMembers || 0}/100 active members.`
      });
    }

    // Check waiting period
    if (welfareStats.waitingPeriodEnd && new Date() < new Date(welfareStats.waitingPeriodEnd)) {
      const waitingEndDate = new Date(welfareStats.waitingPeriodEnd).toLocaleDateString();
      return NextResponse.json({
        canApply: false,
        reason: `Welfare fund is in waiting period. You can apply after ${waitingEndDate}.`
      });
    }

    // Check for any recent applications (prevent spam)
    const recentApplication = await prisma.welfareApplication.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (recentApplication && recentApplication.status === 'PENDING') {
      return NextResponse.json({
        canApply: false,
        reason: 'You have a pending application. Please wait for it to be processed before submitting another.'
      });
    }

    return NextResponse.json({
      canApply: true,
      reason: null
    });
  } catch (error) {
    console.error('Error checking welfare eligibility:', error);
    return NextResponse.json(
      { error: 'Error checking welfare eligibility' },
      { status: 500 }
    );
  }
}