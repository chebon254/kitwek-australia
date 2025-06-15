import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { sendTicketEmail } from '@/lib/nodemailer';
import type Stripe from 'stripe';

interface AttendeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface TicketRequest {
  quantity: number;
  attendees: AttendeeData[];
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { quantity, attendees }: TicketRequest = await request.json();
    const eventId = (await params).id;

    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.remainingSlots < quantity) {
      return NextResponse.json({ error: 'Not enough tickets available' }, { status: 400 });
    }

    // Check if user is logged in
    let userId: string | null = null;
    let userEmail: string | null = null;
    const session = (await cookies()).get('session');
    
    if (session) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
        const user = await prisma.user.findUnique({
          where: { email: decodedClaims.email },
        });
        if (user) {
          userId = user.id;
          userEmail = user.email;
        }
      } catch (authError) {
        console.error("Auth error in ticket purchase:", authError || "Unknown auth error");
        // Continue without user authentication for guest purchases
      }
    }

    // For paid events, create a Stripe checkout session
    if (event.isPaid && event.price) {
      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'aud', // Changed from 'usd' to 'aud'
              product_data: {
                name: event.title,
                description: `${quantity} ticket${quantity > 1 ? 's' : ''}`,
              },
              unit_amount: Math.round(event.price * 100), // Convert to cents
            },
            quantity: quantity,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/tickets?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/events/${event.id}?canceled=true`,
        metadata: {
          type: 'ticket',
          eventId,
          userId: userId || '', // Changed from null to empty string to avoid null issues
          quantity: quantity.toString(),
          attendees: JSON.stringify(attendees),
        },
      };

      // Add customer email if available
      if (userEmail) {
        params.customer_email = userEmail;
      }

      const checkoutSession = await stripe.checkout.sessions.create(params);
      return NextResponse.json({ url: checkoutSession.url });
    }

    // For free events, create tickets directly
    const ticket = await prisma.$transaction(async (prisma) => {
      // Create ticket
      const ticket = await prisma.ticket.create({
        data: {
          eventId,
          userId,
          quantity,
          totalAmount: event.price ? event.price * quantity : 0,
          status: 'ACTIVE',
        },
      });

      // Create attendees
      const createdAttendees = await Promise.all(
        attendees.map((attendee: AttendeeData) =>
          prisma.eventAttendee.create({
            data: {
              eventId,
              ticketId: ticket.id,
              firstName: attendee.firstName,
              lastName: attendee.lastName,
              email: attendee.email,
              phone: attendee.phone || null, // Handle optional phone
              paid: false,
              amount: 0,
            },
          })
        )
      );

      // Update remaining slots
      await prisma.event.update({
        where: { id: eventId },
        data: { remainingSlots: { decrement: quantity } },
      });

      return {
        ...ticket,
        attendees: createdAttendees,
        event,
      };
    });

    // Send ticket emails to all attendees
    for (const attendee of ticket.attendees) {
      await sendTicketEmail(
        attendee.email,
        attendee.firstName,
        ticket.event,
        ticket.id
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error || "Unknown ticket creation error");
    return NextResponse.json(
      { error: 'Error creating ticket' },
      { status: 500 }
    );
  }
}