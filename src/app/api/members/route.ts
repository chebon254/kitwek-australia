import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const members = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        profileImage: true,
        profession: true,
        bio: true,
        twitter: true,
        instagram: true,
        facebook: true,
        youtube: true,
        linkedin: true,
        membershipStatus: true,
      },
      where: {
        membershipStatus: 'ACTIVE',
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}