import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendInactiveMemberReminderEmail } from '@/lib/nodemailer';

export async function POST(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all inactive members who are not revoked
    const inactiveMembers = await prisma.user.findMany({
      where: {
        membershipStatus: 'INACTIVE',
        revokeStatus: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (inactiveMembers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No inactive members found',
        emailsSent: 0,
      });
    }

    let emailsSent = 0;
    const failedEmails: string[] = [];

    // Send emails in batches to avoid overwhelming SMTP server
    const batchSize = 5;
    for (let i = 0; i < inactiveMembers.length; i += batchSize) {
      const batch = inactiveMembers.slice(i, i + batchSize);

      const emailPromises = batch.map(async (member) => {
        try {
          const name = member.firstName && member.lastName
            ? `${member.firstName} ${member.lastName}`
            : member.firstName || 'Member';

          await sendInactiveMemberReminderEmail(member.email, name);
          emailsSent++;
        } catch (error) {
          console.error(`Failed to send reminder to ${member.email}:`, error);
          failedEmails.push(member.email);
        }
      });

      await Promise.allSettled(emailPromises);

      // Small delay between batches
      if (i + batchSize < inactiveMembers.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully sent ${emailsSent} reminder emails to inactive members`,
      emailsSent,
      totalInactive: inactiveMembers.length,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[CRON_INACTIVE_MEMBERS]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
