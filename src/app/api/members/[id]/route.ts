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
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        profession: true,
        bio: true,
        twitter: true,
        instagram: true,
        facebook: true,
        youtube: true,
        linkedin: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}