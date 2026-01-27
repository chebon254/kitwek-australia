import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch a specific ticket by ID (public access)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            date: true,
            location: true,
          },
        },
        attendees: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Return ticket data (accessible publicly)
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Error fetching ticket' },
      { status: 500 }
    );
  }
}
