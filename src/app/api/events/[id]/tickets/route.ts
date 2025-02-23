import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { sendTicketEmail } from '@/lib/nodemailer';
import type Stripe from 'stripe';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { quantity, attendees } = await request.json();
    const { id: eventId } = await params;

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
    let userId = null;
    let userEmail = null;
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    if (session) {
      const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
      const user = await prisma.user.findUnique({
        where: { email: decodedClaims.email },
      });
      if (user) {
        userId = user.id;
        userEmail = user.email;
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
              currency: 'usd',
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
          eventId: event.id,
          userId,
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
        },
      });

      // Create attendees
      const createdAttendees = await Promise.all(
        attendees.map((attendee: any) =>
          prisma.eventAttendee.create({
            data: {
              eventId,
              ticketId: ticket.id,
              firstName: attendee.firstName,
              lastName: attendee.lastName,
              email: attendee.email,
              phone: attendee.phone,
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
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Error creating ticket' },
      { status: 500 }
    );
  }
}