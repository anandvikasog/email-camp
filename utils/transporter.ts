// transporter.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.NEXT_PUBLIC_MAILGUN_USER || '',
    pass: process.env.NEXT_PUBLIC_MAILGUN_PASS || '',
  },
});

export default transporter;
