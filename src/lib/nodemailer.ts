import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendWelcomeEmail = async (email: string, username: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .payment-info {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .amount {
            font-size: 24px;
            color: #f59e0b;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Almost There - Complete Your Membership!</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Thank you for signing up with Kitwek Victoria! Your account has been created successfully.</p>
            
            <div class="payment-info">
              <h3 style="margin-top: 0; color: #92400e;">⚠️ You are not yet a member</h3>
              <p>To become a full member of Kitwek Victoria and unlock all member benefits, you need to complete your membership payment.</p>
              <div class="amount">AUD $30.00</div>
              <p style="text-align: center; margin-bottom: 0;"><strong>One-time Membership Fee</strong></p>
            </div>

            <p><strong>What you'll get as a member:</strong></p>
            <ul>
              <li>Official member number and status</li>
              <li>Access to member directory</li>
              <li>Participation in forums and discussions</li>
              <li>Access to exclusive events and activities</li>
              <li>Full community privileges</li>
            </ul>

            <p>Complete your membership payment now to join our community:</p>
            
            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard/membership" style="color: #FFFFFF !important;" class="button">
              Pay AUD $30 & Become a Member
            </a>
            
            <p>If you have any questions about membership or need assistance with payment, don't hesitate to reach out to our support team.</p>
            
            <p>We look forward to welcoming you as a full member!</p>
            
            <p>Best regards,<br>The Kitwek Victoria Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Complete Your Kitwek Victoria Membership - Payment Required",
    html,
  });
};

export const sendMembershipConfirmationEmail = async (
  email: string,
  name: string,
  memberNumber: string
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #10b981;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .member-info {
            background-color: #d1fae5;
            border: 2px solid #10b981;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .member-number {
            font-size: 28px;
            color: #065f46;
            font-weight: bold;
            margin: 10px 0;
          }
          .payment-details {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .success-icon {
            font-size: 48px;
            color: #10b981;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Kitwek Victoria!</h1>
            <h2 style="margin: 0;">You are now an official member!</h2>
          </div>
          <div class="content">
            <div class="success-icon">✅</div>
            
            <h2>Congratulations ${name}!</h2>
            <p><strong>You are now an official member of Kitwek Victoria!</strong> Your membership payment has been processed successfully.</p>
            
            <div class="member-info">
              <h3 style="margin-top: 0; color: #065f46;">Your Official Member Details</h3>
              <p style="margin: 10px 0;">Member Number:</p>
              <div class="member-number">${memberNumber}</div>
              <p style="margin-bottom: 0; color: #047857;"><strong>Status: Active Member</strong></p>
            </div>
            
            <div class="payment-details">
              <h3>Payment Confirmation</h3>
              <p><strong>Amount Paid:</strong> AUD $30.00</p>
              <p><strong>Type:</strong> One-time Membership Fee</p>
              <p><strong>Status:</strong> ✅ Completed</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <p><strong>As a member, you now have full access to:</strong></p>
            <ul>
              <li>✅ Complete member directory access</li>
              <li>✅ Full participation in community forums</li>
              <li>✅ Access to all member events and activities</li>
              <li>✅ Voting rights in community decisions</li>
              <li>✅ Priority support and assistance</li>
            </ul>

            <p style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <strong>📄 Constitution Attached:</strong> Please find attached our organization's constitution document which outlines our principles, guidelines, and community values. We encourage all members to review this important document.
            </p>

            <a href="${
              process.env.NEXT_PUBLIC_URL
            }/dashboard" style="color: #FFFFFF !important;" class="button">
              Access Your Member Dashboard
            </a>

            <p>Please save this email for your records, including your member number <strong>${memberNumber}</strong> for future reference.</p>

            <p>If you have any questions about your membership or need assistance, please don't hesitate to contact our support team.</p>

            <p>Welcome to the Kitwek Victoria community!</p>

            <p>Best regards,<br>The Kitwek Victoria Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "🎉 Welcome! You're Now an Official Kitwek Victoria Member",
    html,
    attachments: [
      {
        filename: "Kitwek Victoria - Strengthening the Kalenjin Community.pdf",
        path: path.join(
          process.cwd(),
          "public/files/Kitwek Victoria - Strengthening the Kalenjin Community.pdf"
        ),
      },
    ],
  });
};

export const sendSubscriptionConfirmationEmail = async (
  email: string,
  name: string,
  plan: {
    name: string;
    amount: number;
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .subscription-details {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Subscription Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for renewing your annual plan. Your subscription is now active!</p>
            
            <div class="subscription-details">
              <h3>Subscription Details</h3>
              <p><strong>Plan:</strong> Annual Membership</p>
              <p><strong>Amount:</strong> AUD $${plan.amount.toFixed(2)}/year</p>
              <p><strong>Status:</strong> Active</p>
              <p><strong>Billing Cycle:</strong> Annual</p>
            </div>

            <a href="${
              process.env.NEXT_PUBLIC_URL
            }/dashboard" style="color: #FFFFFF !important;" class="button">
              Go to Dashboard
            </a>

            <p>If you have any questions about your subscription, please don't hesitate to contact our support team.</p>

            <p>Best regards,<br>The Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `${plan.name} Subscription Activated!`,
    html,
  });
};

export const sendTicketEmail = async (
  email: string,
  name: string,
  event: {
    title: string;
    date: string | Date;
    location: string;
  },
  ticketId: string,
  isPublic: boolean = false
) => {
  const ticketUrl = isPublic
    ? `${process.env.NEXT_PUBLIC_URL}/tickets/${ticketId}`
    : `${process.env.NEXT_PUBLIC_URL}/tickets`;

  const ticketLinkText = isPublic
    ? 'View Your Ticket'
    : 'View My Tickets';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .ticket {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .qr-code {
            text-align: center;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Event Ticket</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for purchasing a ticket to ${
              event.title
            }. Here are your ticket details:</p>
            
            <div class="ticket">
              <h3>${event.title}</h3>
              <p><strong>Date:</strong> ${new Date(
                event.date
              ).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date(
                event.date
              ).toLocaleTimeString()}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Ticket ID:</strong> ${ticketId}</p>
            </div>

            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}" alt="QR Code" />
            </div>

            <p>Please keep this email for your records. You'll need to show your ticket (either printed or on your mobile device) at the event.</p>

            <a href="${ticketUrl}" style="color: #FFFFFF !important;" class="button">
              ${ticketLinkText}
            </a>

            ${isPublic ? `
            <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0;"><strong>📱 Your Ticket Link:</strong></p>
              <p style="margin: 5px 0; word-break: break-all;">
                <a href="${ticketUrl}" style="color: #2563eb;">${ticketUrl}</a>
              </p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #1e40af;">
                You can access your ticket anytime using this link. No login required!
              </p>
            </div>
            ` : ''}

            <p>If you have any questions or need to make changes to your ticket, please contact our support team.</p>

            <p>We look forward to seeing you at the event!</p>

            <p>Best regards,<br>The Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `Your Ticket for ${event.title}`,
    html,
  });
};

export const sendDonationEmail = async (
  email: string,
  name: string,
  donation: {
    name: string;
    amount: number;
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .donation-details {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .amount {
            font-size: 24px;
            color: #4F46E5;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .heart {
            color: #ef4444;
            font-size: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Donation!</h1>
          </div>
          <div class="content">
            <h2>Dear ${name},</h2>
            <p>Thank you for your generous donation to ${
              donation.name
            }. Your support means the world to us and will help make a real difference.</p>
            
            <div class="donation-details">
              <div class="amount">AUD $${donation.amount.toLocaleString()}</div>
              <p style="text-align: center;">Your contribution to:<br><strong>${
                donation.name
              }</strong></p>
            </div>

            <p>Your donation will be put to good use in supporting our cause. We're grateful for your commitment to making a positive impact in our community.</p>

            <p style="text-align: center;" class="heart">❤️</p>

            <a href="${
              process.env.NEXT_PUBLIC_URL
            }/donations" class="button" style="color: #FFFFFF !important; display: block; text-align: center;">
              Support More Causes
            </a>

            <p>If you have any questions about your donation or would like to learn more about how your contribution will be used, please don't hesitate to contact us.</p>

            <p>With gratitude,<br>The Team</p>

            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              This email serves as your donation receipt. Please keep it for your records.
              Your donation may be tax-deductible; please consult with your tax advisor.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `Thank You for Your Donation to ${donation.name}`,
    html,
  });
};

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .contact-details {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="contact-details">
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Subject:</strong> ${data.subject}</p>
            </div>
            
            <h2>Message:</h2>
            <p>${data.message || "No additional message provided"}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: "info@kitwekvictoria.org",
    subject: `Contact Form: ${data.subject}`,
    html,
    replyTo: data.email,
  });
};

export const sendWelfareRegistrationConfirmationEmail = async (
  email: string,
  name: string,
  registration: {
    registrationFee: number;
    activatedAt: Date | null;
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #10b981;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .welfare-info {
            background-color: #d1fae5;
            border: 2px solid #10b981;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .payment-details {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .benefits {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .success-icon {
            font-size: 48px;
            color: #10b981;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Kitwek Victoria Welfare!</h1>
            <h2 style="margin: 0;">You are now a welfare member!</h2>
          </div>
          <div class="content">
            <div class="success-icon">✅</div>
            
            <h2>Congratulations ${name}!</h2>
            <p><strong>You are now an active member of the Kitwek Victoria Welfare Department!</strong> Your registration payment has been processed successfully.</p>
            
            <div class="welfare-info">
              <h3 style="margin-top: 0; color: #065f46;">Your Welfare Membership Details</h3>
              <p style="margin: 10px 0;">Status: <strong>Active Member</strong></p>
              <p style="margin: 10px 0;">Registration Fee: <strong>AUD ${registration.registrationFee.toFixed(
                2
              )}</strong></p>
              <p style="margin-bottom: 0; color: #047857;">
                <strong>Activated: ${
                  registration.activatedAt
                    ? new Date(registration.activatedAt).toLocaleDateString()
                    : "Today"
                }</strong>
              </p>
            </div>
            
            <div class="payment-details">
              <h3>Payment Confirmation</h3>
              <p><strong>Amount Paid:</strong> AUD ${registration.registrationFee.toFixed(
                2
              )}</p>
              <p><strong>Type:</strong> One-time Welfare Registration Fee</p>
              <p><strong>Status:</strong> ✅ Completed</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="benefits">
              <h3 style="margin-top: 0; color: #92400e;">Your Welfare Benefits</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Family Death Support:</strong> AUD $5,000 for immediate family members (spouse, child, or parent)</li>
                <li><strong>Member Death Support:</strong> AUD $8,000 to immediate family when a member passes</li>
                <li><strong>Community Support:</strong> Access to our caring community network</li>
                <li><strong>Transparent Process:</strong> Clear claim procedures and timelines</li>
              </ul>
            </div>

            <h3>Important Information:</h3>
            <ul>
              <li>The welfare fund needs a minimum of 100 active members to become operational</li>
              <li>There is a 2-month waiting period after the fund becomes operational before claims can be made</li>
              <li>All bereavements must be reported within 7 days of occurrence</li>
              <li>After any claim is paid, all members will contribute to replenish the fund</li>
              <li>Required documentation must be provided for all claims</li>
            </ul>

            <a href="${
              process.env.NEXT_PUBLIC_URL
            }/dashboard/welfare" style="color: #FFFFFF !important;" class="button">
              Access Your Welfare Dashboard
            </a>

            <p>Please save this email for your records. If you have any questions about your welfare membership or the claims process, please don't hesitate to contact our support team.</p>

            <p>Thank you for joining our caring community. Together, we support each other in times of need.</p>

            <p>Best regards,<br>The Kitwek Victoria Welfare Department</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "🎉 Welcome to Kitwek Victoria Welfare - Registration Confirmed!",
    html,
  });
};

export const sendInactiveMemberReminderEmail = async (
  email: string,
  name: string
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f59e0b;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .reminder-box {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Membership Activation Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We noticed your Kitwek Victoria membership is still <strong>inactive</strong>. You're missing out on exclusive benefits and community engagement!</p>

            <div class="reminder-box">
              <h3 style="margin-top: 0; color: #92400e;">Complete Your Activation Today</h3>
              <p style="margin-bottom: 0;">Activate your membership for just <strong>AUD $30</strong> and unlock full access to our community.</p>
            </div>

            <p><strong>What you'll get as an active member:</strong></p>
            <ul>
              <li>✅ Official member number and status</li>
              <li>✅ Access to member directory</li>
              <li>✅ Participation in forums and discussions</li>
              <li>✅ Access to exclusive events and activities</li>
              <li>✅ Voting rights in community decisions</li>
              <li>✅ Welfare program eligibility</li>
            </ul>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_URL}/dashboard/membership" style="color: #FFFFFF !important;" class="button">
                Activate Membership Now
              </a>
            </div>

            <p style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <strong>📄 Constitution Attached:</strong> Please find attached our organization's constitution document which outlines our principles and community values.
            </p>

            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

            <p>Best regards,<br>The Kitwek Victoria Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "⏰ Reminder: Activate Your Kitwek Victoria Membership",
    html,
    attachments: [
      {
        filename: "Kitwek Victoria - Strengthening the Kalenjin Community.pdf",
        path: path.join(
          process.cwd(),
          "public/files/Kitwek Victoria - Strengthening the Kalenjin Community.pdf"
        ),
      },
    ],
  });
};

export const sendInactiveWelfareReminderEmail = async (
  email: string,
  name: string,
  registrationStatus: "not_registered" | "pending_payment"
) => {
  const isNotRegistered = registrationStatus === "not_registered";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #8b5cf6;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .welfare-box {
            background-color: #f3e8ff;
            border: 2px solid #8b5cf6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .benefits-box {
            background-color: #d1fae5;
            border: 1px solid #10b981;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🤝 Join Kitwek Victoria Welfare</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>${
              isNotRegistered
                ? "You haven't registered for the Kitwek Victoria Welfare program yet. Don't miss this opportunity to be part of our caring community!"
                : "Your welfare registration payment is still pending. Complete your payment today to activate your welfare membership!"
            }</p>

            <div class="welfare-box">
              <h3 style="margin-top: 0; color: #5b21b6;">${
                isNotRegistered ? "Register Today" : "Complete Your Payment"
              }</h3>
              <p><strong>Registration Fee:</strong> AUD $100 (one-time)</p>
              <p style="margin-bottom: 0;">Secure your place in our community support network.</p>
            </div>

            <div class="benefits-box">
              <h3 style="margin-top: 0; color: #065f46;">Welfare Benefits</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Family Death Support:</strong> AUD $5,000 for immediate family members</li>
                <li><strong>Member Death Support:</strong> AUD $8,000 to immediate family when a member passes</li>
                <li><strong>Community Support:</strong> Access to our caring community network</li>
                <li><strong>Transparent Process:</strong> Clear claim procedures and timelines</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${
                process.env.NEXT_PUBLIC_URL
              }/dashboard/welfare" style="color: #FFFFFF !important;" class="button">
                ${isNotRegistered ? "Register Now" : "Complete Payment"}
              </a>
            </div>

            <h3>Important Information:</h3>
            <ul>
              <li>The welfare fund needs a minimum of 100 active members to become operational</li>
              <li>There is a 2-month waiting period after the fund becomes operational</li>
              <li>All bereavements must be reported within 7 days</li>
            </ul>

            <p style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <strong>📄 Constitution Attached:</strong> Please review our organization's constitution which outlines our principles and welfare program guidelines.
            </p>

            <p>If you have any questions about the welfare program, please contact our support team.</p>

            <p>Best regards,<br>The Kitwek Victoria Welfare Department</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "🤝 Join Kitwek Victoria Welfare - Community Support Program",
    html,
    attachments: [
      {
        filename: "Kitwek Victoria - Strengthening the Kalenjin Community.pdf",
        path: path.join(
          process.cwd(),
          "public/files/Kitwek Victoria - Strengthening the Kalenjin Community.pdf"
        ),
      },
    ],
  });
};

export const sendReimbursementConfirmationEmail = async (
  email: string,
  name: string,
  reimbursement: {
    amountPaid: number;
    application: {
      deceasedName: string;
      applicationType: string;
      user?: {
        firstName?: string | null;
        lastName?: string | null;
        username?: string | null;
      };
    };
  }
) => {
  // Get applicant name (the person who applied for and received the benefit)
  const applicantName = reimbursement.application.user?.firstName && reimbursement.application.user?.lastName
    ? `${reimbursement.application.user.firstName} ${reimbursement.application.user.lastName}`
    : reimbursement.application.user?.username || 'N/A';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #10b981;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          }
          .payment-box {
            background-color: #d1fae5;
            border: 2px solid #10b981;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Reimbursement Payment Confirmed</h1>
          </div>
          <div class="content">
            <h2>Dear ${name},</h2>
            <p>Thank you for your reimbursement payment of <strong>AUD $${reimbursement.amountPaid.toFixed(2)}</strong>.</p>
            <p>This payment contributes to replenishing the welfare fund following the payout for <strong>${reimbursement.application.deceasedName}</strong>.</p>

            <div class="payment-box">
              <h3 style="margin-top: 0; color: #065f46;">Payment Details</h3>
              <div class="detail-row">
                <span><strong>Amount Paid:</strong></span>
                <span>AUD $${reimbursement.amountPaid.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span><strong>Application Type:</strong></span>
                <span>${reimbursement.application.applicationType === 'MEMBER_DEATH' ? 'Member Death' : 'Family Death'}</span>
              </div>
              <div class="detail-row">
                <span><strong>Beneficiary:</strong></span>
                <span>${applicantName}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span><strong>Payment Date:</strong></span>
                <span>${new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <p style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <strong>ℹ️ About Reimbursements:</strong> When the welfare fund makes a payout to support a member or their family, active members contribute a small reimbursement to maintain the fund's sustainability. Your contribution helps us continue supporting our community.
            </p>

            <p>Thank you for being part of our caring community and supporting fellow members in their time of need.</p>
            <p>Best regards,<br>The Kitwek Victoria Welfare Department</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "✅ Welfare Reimbursement Payment Confirmed - Kitwek Victoria",
    html,
  });
};
