import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/mail';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { name, email, phone, country, password} = await request.json();

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        country,
        password: hashedPassword,
        membershipStatus: 'INACTIVE',
      },
    });

    // Try to send welcome email, but don't block registration if it fails
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with registration even if email fails
    }

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Check if error is a Prisma error with a code property
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}