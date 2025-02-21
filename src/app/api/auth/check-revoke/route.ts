import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { revokeStatus: true, revokeReason: true }
    });

    if (user?.revokeStatus) {
      return NextResponse.json({
        error: 'Account revoked',
        reason: user.revokeReason
      }, { status: 403 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Check revoke error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}