// api/send-otp.js
import { NextRequest, NextResponse } from 'next/server';
import transporter from '~/utils/transporter'; // Adjust the import path as necessary
import Otp from '~/models/otp';
import { validateUser } from '~/utils/helper';

export async function POST(req: NextRequest) {
  const user = await validateUser();
  if (!user) {
    return NextResponse.json(
      {
        status: false,
        message: 'Unauthorized.',
      },
      { status: 401 }
    );
  }

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { status: false, message: 'Email is required.' },
      { status: 400 }
    );
  }

  // Generate a random OTP (valid for 5 minutes)
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpExpiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  // Save the OTP to the database
  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt: otpExpiryTime, verified: false },
    { upsert: true, new: true }
  );

  // Send the OTP to the user's email using the imported transporter
  await transporter.sendMail({
    from: process.env.NEXT_PUBLIC_MAILGUN_USER, // Use your Mailgun user from environment variables
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  });

  return NextResponse.json(
    { status: true, message: 'OTP sent successfully.' },
    { status: 200 }
  );
}
