import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { sendPasswordResetEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Generate password reset link
    const link = await auth.generatePasswordResetLink(email);
    
    // Send password reset email
    await sendPasswordResetEmail(email, link);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to send password reset email' },
      { status: 500 }
    );
  }
}