import nodemailer from 'nodemailer';

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
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Welcome to Our Platform!',
    html: `
      <h1>Welcome ${username}!</h1>
      <p>Thank you for joining our platform.</p>
      <p>To activate your membership, please click the link below:</p>
      <a href="${process.env.NEXT_PUBLIC_URL}/dashboard/membership">Activate Membership</a>
    `,
  });
};
