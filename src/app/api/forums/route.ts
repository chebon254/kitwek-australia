import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const forums = await prisma.forum.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            name: true,
            profileImage: true,
          },
        },
        _count: {
          select: { comments: true }
        }
      }
    });

    return NextResponse.json(forums);
  } catch (error) {
    console.error('Error fetching forums:', error);
    return NextResponse.json(
      { error: 'Error fetching forums' },
      { status: 500 }
    );
  }
}