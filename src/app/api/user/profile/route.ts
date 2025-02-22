import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = (await cookies()).get('session');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    const data = await request.json();

    // Remove readonly fields
    const { ...updateData } = data;
    // const { email, membershipStatus, subscription, ...updateData } = data;

    const user = await prisma.user.update({
      where: { email: decodedClaims.email },
      data: updateData,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Error updating profile' },
      { status: 500 }
    );
  }
}