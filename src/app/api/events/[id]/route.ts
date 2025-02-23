import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Type for route handler context
type RouteContext = {
  params: Promise<{ id: string }>
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tickets: true }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Error fetching event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const data = await request.json();
    const event = await prisma.event.update({
      where: { id },
      data,
    });
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Error updating event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    await prisma.event.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Error deleting event' },
      { status: 500 }
    );
  }
}