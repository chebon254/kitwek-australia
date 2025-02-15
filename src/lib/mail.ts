import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
  } catch (error) {
    console.error('SMTP verification failed:', error);
    throw error;
  }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    await verifyEmailConfig();
    
    const result = await transporter.sendMail({
      from: `"Kitwek Australia" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Our Membership Platform',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for signing up. To activate your membership, please complete the payment process.</p>
        <p>Visit your dashboard to get started: ${process.env.NEXT_PUBLIC_URL}/dashboard/membership</p>
      `,
    });
    
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
};

export const sendPaymentConfirmation = async (email: string, name: string) => {
  try {
    await verifyEmailConfig();
    
    const result = await transporter.sendMail({
      from: `"Kitwek Australia" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Membership Payment Confirmed',
      html: `
        <h1>Payment Successful!</h1>
        <p>Dear ${name},</p>
        <p>Your membership payment has been processed successfully. Your account is now active.</p>
        <p>You can access your dashboard here: ${process.env.NEXT_PUBLIC_URL}/dashboard</p>
      `,
    });
    
    return result;
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  try {
    await verifyEmailConfig();
    
    const result = await transporter.sendMail({
      from: `"Kitwek Australia" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
    
    return result;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};