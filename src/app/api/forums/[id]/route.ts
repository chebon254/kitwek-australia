import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forum = await prisma.forum.findUnique({
      where: { id: (await params).id },
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });

    if (!forum) {
      return NextResponse.json({ error: 'Forum not found' }, { status: 404 });
    }

    return NextResponse.json(forum);
  } catch (error) {
    console.error('Error fetching forum:', error);
    return NextResponse.json(
      { error: 'Error fetching forum' },
      { status: 500 }
    );
  }
}