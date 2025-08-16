import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST ?? 'localhost',
  port: parseInt(SMTP_PORT ?? '587', 10),
  secure: SMTP_PORT === '465',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendOTPEmail = async (toEmail: string, username: string, otp: string): Promise<void> => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('Mailing is not configured. Please check your .env file.');
    return;
  }

  const mailOptions = {
    from: EMAIL_FROM ?? SMTP_USER,
    to: toEmail,
    subject: 'Your OTP for Banking Application Registration',
    html: `
      <h2>Hello, ${username}!</h2>
      <p>Thank you for registering with our banking application.</p>
      <p>Your One-Time Password (OTP) for registration is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This code will expire in 10 minutes. Do not share this with anyone.</p>
    `,
  };

  try {
    // await transporter.sendMail(mailOptions);
    console.log(mailOptions);
  } catch (error) {
    console.error('Failed to send OTP email:');
    throw error;
  }
};
