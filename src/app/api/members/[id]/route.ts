import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const member = await prisma.user.findUnique({
      where: { id: (await params).id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        profileImage: true,
        subscription: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}