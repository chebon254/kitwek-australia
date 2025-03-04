import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject) {
      return NextResponse.json(
        { error: 'Name, email, and subject are required' }, 
        { status: 400 }
      );
    }

    // Send email
    await sendContactEmail({
      name,
      email,
      subject,
      message: message || 'No additional message provided'
    });

    return NextResponse.json(
      { message: 'Email sent successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' }, 
      { status: 500 }
    );
  }
}