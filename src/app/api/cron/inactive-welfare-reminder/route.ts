import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendInactiveWelfareReminderEmail } from '@/lib/nodemailer';

export async function POST(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get active general members who haven't registered for welfare
    const membersWithoutWelfare = await prisma.user.findMany({
      where: {
        membershipStatus: 'ACTIVE',
        revokeStatus: false,
        welfareRegistration: null, // No welfare registration at all
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    // Get members with pending welfare payments
    const pendingWelfarePayments = await prisma.welfareRegistration.findMany({
      where: {
        paymentStatus: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const totalToEmail = membersWithoutWelfare.length + pendingWelfarePayments.length;

    if (totalToEmail === 0) {
      return NextResponse.json({
        success: true,
        message: 'No inactive welfare members found',
        emailsSent: 0,
      });
    }

    let emailsSent = 0;
    const failedEmails: string[] = [];

    // Send emails to members without welfare registration
    const batchSize = 5;

    // Process members without welfare
    for (let i = 0; i < membersWithoutWelfare.length; i += batchSize) {
      const batch = membersWithoutWelfare.slice(i, i + batchSize);

      const emailPromises = batch.map(async (member) => {
        try {
          const name = member.firstName && member.lastName
            ? `${member.firstName} ${member.lastName}`
            : member.firstName || 'Member';

          await sendInactiveWelfareReminderEmail(member.email, name, 'not_registered');
          emailsSent++;
        } catch (error) {
          console.error(`Failed to send welfare reminder to ${member.email}:`, error);
          failedEmails.push(member.email);
        }
      });

      await Promise.allSettled(emailPromises);

      if (i + batchSize < membersWithoutWelfare.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Process members with pending payments
    for (let i = 0; i < pendingWelfarePayments.length; i += batchSize) {
      const batch = pendingWelfarePayments.slice(i, i + batchSize);

      const emailPromises = batch.map(async (registration) => {
        try {
          if (!registration.user) return;

          const name = registration.user.firstName && registration.user.lastName
            ? `${registration.user.firstName} ${registration.user.lastName}`
            : registration.user.firstName || 'Member';

          await sendInactiveWelfareReminderEmail(
            registration.user.email,
            name,
            'pending_payment'
          );
          emailsSent++;
        } catch (error) {
          console.error(`Failed to send payment reminder to ${registration.user?.email}:`, error);
          if (registration.user?.email) {
            failedEmails.push(registration.user.email);
          }
        }
      });

      await Promise.allSettled(emailPromises);

      if (i + batchSize < pendingWelfarePayments.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully sent ${emailsSent} welfare reminder emails`,
      emailsSent,
      breakdown: {
        notRegistered: membersWithoutWelfare.length,
        pendingPayment: pendingWelfarePayments.length,
      },
      totalTargeted: totalToEmail,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[CRON_INACTIVE_WELFARE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
