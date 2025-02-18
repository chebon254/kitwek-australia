import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/nodemailer';

export async function POST(request: Request) {
  const { idToken, username } = await request.json();
  
  try {
    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (!decodedToken.email) {
      throw new Error('Email is required');
    }

    const email = decodedToken.email;
    const uid = decodedToken.uid;

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        username: username || undefined,
      },
      create: {
        id: uid,
        email: email,
        username: username || email.split('@')[0], // Use email prefix as fallback username
        membershipStatus: 'INACTIVE',
        subscription: 'Free'
      },
    });

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    // Set cookie
    (await cookies()).set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });

    // Send welcome email
    if (user) {
      try {
        await sendWelcomeEmail(email, user.username || email);
      } catch (error) {
        console.error('Error sending welcome email:', error);
      }
    }

    return NextResponse.json({ status: 'success', user });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unauthorized' 
    }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).delete('session');
  return NextResponse.json({ status: 'success' });
}