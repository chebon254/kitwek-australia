import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/nodemailer';
import { generateMemberNumber } from '@/lib/memberNumber';

export async function POST(request: Request) {
  try {
    const { idToken, username } = await request.json();

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      throw new Error('Email is required');
    }

    const email = decodedToken.email;
    const uid = decodedToken.uid;

    // Check if user is revoked
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { revokeStatus: true, revokeReason: true, memberNumber: true }
    });

    if (existingUser?.revokeStatus) {
      return NextResponse.json({
        error: 'Account revoked',
        reason: existingUser.revokeReason
      }, { status: 403 });
    }

    // Generate member number for new users
    let memberNumber = existingUser?.memberNumber;
    if (!existingUser) {
      memberNumber = await generateMemberNumber();
    }

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        username: username || undefined,
      },
      create: {
        id: uid,
        email,
        username: username || email.split('@')[0], // Use email prefix as fallback username
        memberNumber,
        membershipStatus: 'INACTIVE',
        subscription: 'Free'
      },
    });

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set cookie
    (await
      // Set cookie
      cookies()).set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });

    // Only send welcome email if this is a new user (check if the operation was a create)
    if (!existingUser) {
      try {
        // Convert null to undefined to satisfy TypeScript
        const memberNumberForEmail = user.memberNumber || undefined;
        await sendWelcomeEmail(email, user.username || email, memberNumberForEmail);
      } catch (error) {
        console.error('Error sending welcome email:', error);
        // Continue even if email fails
      }
    }

    return NextResponse.json({ status: 'success', user });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  (await cookies()).delete('session');
  return NextResponse.json({ status: 'success' });
}