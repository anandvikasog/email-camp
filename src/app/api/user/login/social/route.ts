import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/db/db';
import User from '~/models/user';
import { encryptText, hashPassword } from '~/utils/helper';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { email, provider } = data;

    // Login failed
    if (!email || !provider) {
      return NextResponse.json(
        { status: false, message: 'Please provide email and provider.' },
        { status: 400 }
      );
    }

    let user = await User.findOne({
      email,
    });

    if (!user) {
      const hashedPassword = await hashPassword('Password@12345');
      user = new User({
        email,
        password: hashedPassword,
        provider,
        emailVerified: true,
      });
      await user.save();
    }

    const token = await encryptText({ id: user._id });

    // Login Success
    return NextResponse.json(
      {
        status: true,
        message: 'Logged in successfully.',
        token,
        data: {
          _id: user._id,
          email,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.log('e', e);
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
