import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let tickets;

    // Check if user is logged in
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    if (session) {
      const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
      const user = await prisma.user.findUnique({
        where: { email: decodedClaims.email },
      });

      if (user) {
        // Get tickets for logged-in user
        tickets = await prisma.ticket.findMany({
          where: { userId: user.id },
          include: {
            event: true,
            attendees: true,
          },
          orderBy: { purchaseDate: 'desc' },
        });
      }
    } else if (email) {
      // Get tickets by attendee email for non-logged-in users
      tickets = await prisma.ticket.findMany({
        where: {
          attendees: {
            some: { email },
          },
        },
        include: {
          event: true,
          attendees: true,
        },
        orderBy: { purchaseDate: 'desc' },
      });
    } else {
      return NextResponse.json(
        { error: 'Email is required for non-logged-in users' },
        { status: 400 }
      );
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Error fetching tickets' },
      { status: 500 }
    );
  }
}