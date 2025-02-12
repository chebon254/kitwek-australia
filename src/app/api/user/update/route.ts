import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const session = (await cookies()).get('session')?.value;

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decodedClaims = await auth.verifySessionCookie(session, true);
    const data = await request.json();

    const user = await prisma.user.update({
      where: { email: decodedClaims.email },
      data,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}