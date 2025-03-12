import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendWelcomeEmail = async (
  email: string,
  username: string,
  memberNumber?: string
) => {
  const memberInfo = memberNumber
    ? `<p>Your member number is: <strong>${memberNumber}</strong></p>`
    : "";

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
            <h1>Welcome to Kitwek Victoria!</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Thank you for joining our platform. We're excited to have you as part of our community!</p>
            ${memberInfo}
            <p>To complete your membership and unlock all features, please activate your account by clicking the button below:</p>
            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard/membership" style="color: #FFFFFF !important;" class="button">
              Activate Membership
            </a>
            <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
            <p>Best regards,<br>The Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Welcome to Our Platform!",
    html,
  });
};

export const sendMembershipConfirmationEmail = async (
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
          .payment-details {
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
            <h1>Membership Activated!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for activating your membership. Your payment has been processed successfully!</p>
            
            <div class="payment-details">
              <h3>Payment Details</h3>
              <p><strong>Amount Paid:</strong> $30.00</p>
              <p><strong>Type:</strong> One-time Membership Fee</p>
              <p><strong>Status:</strong> Completed</p>
            </div>

            <p>You now have full access to all member features including:</p>
            <ul>
              <li>Access to member directory</li>
              <li>Participation in forums</li>
              <li>Access to events and activities</li>
            </ul>

            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="color: #FFFFFF !important;" class="button">
              Go to Dashboard
            </a>

            <p>If you have any questions about your membership, please don't hesitate to contact our support team.</p>

            <p>Best regards,<br>The Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Membership Successfully Activated!",
    html,
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
              <p><strong>Amount:</strong> $${plan.amount.toFixed(2)}/year</p>
              <p><strong>Status:</strong> Active</p>
              <p><strong>Billing Cycle:</strong> Annual</p>
            </div>

            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="color: #FFFFFF !important;" class="button">
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
  ticketId: string
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
            <p>Thank you for purchasing a ticket to ${event.title}. Here are your ticket details:</p>
            
            <div class="ticket">
              <h3>${event.title}</h3>
              <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date(event.date).toLocaleTimeString()}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Ticket ID:</strong> ${ticketId}</p>
            </div>

            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}" alt="QR Code" />
            </div>

            <p>Please keep this email for your records. You'll need to show your ticket (either printed or on your mobile device) at the event.</p>
            
            <a href="${process.env.NEXT_PUBLIC_URL}/tickets" style="color: #FFFFFF !important;" class="button">
              View My Tickets
            </a>

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
            <p>Thank you for your generous donation to ${donation.name}. Your support means the world to us and will help make a real difference.</p>
            
            <div class="donation-details">
              <div class="amount">$${donation.amount.toLocaleString()}</div>
              <p style="text-align: center;">Your contribution to:<br><strong>${donation.name}</strong></p>
            </div>

            <p>Your donation will be put to good use in supporting our cause. We're grateful for your commitment to making a positive impact in our community.</p>

            <p style="text-align: center;" class="heart">❤️</p>

            <a href="${process.env.NEXT_PUBLIC_URL}/donations" class="button" style="color: #FFFFFF !important; display: block; text-align: center;">
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