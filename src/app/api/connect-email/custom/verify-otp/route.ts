// api/verify-otp.js
import { NextRequest, NextResponse } from 'next/server';
import Otp from '~/models/otp';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { status: false, message: 'Email and OTP are required.' },
        { status: 400 }
      );
    }

    // Find the OTP record in the database
    const storedOtpData = await Otp.findOne({ email });

    if (!storedOtpData) {
      return NextResponse.json(
        { status: false, message: 'OTP expired or not sent.' },
        { status: 400 }
      );
    }

    // Check if OTP matches and is still valid
    const isOtpValid =
      storedOtpData.otp === otp &&
      Date.now() < new Date(storedOtpData.expiresAt).getTime();

    if (!isOtpValid) {
      return NextResponse.json(
        { status: false, message: 'Invalid or expired OTP.' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    storedOtpData.verified = true;
    await storedOtpData.save();

    return NextResponse.json(
      { status: true, message: 'OTP verified successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error verifying OTP:', error);
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
