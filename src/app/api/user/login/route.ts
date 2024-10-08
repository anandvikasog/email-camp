import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/db/db';
import User from '~/models/user';
import { comparePassword, encryptText } from '~/utils/helper';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { email, password } = data;

    // Login failed
    if (!email || !password) {
      return NextResponse.json(
        { status: false, message: 'Please provide email and password.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email,
    });

    // Login failed
    if (!user) {
      return NextResponse.json(
        { status: false, message: 'Incorrect email or password.' },
        { status: 404 }
      );
    }

    const isPasswordVerified = await comparePassword(password, user.password);

    // Login failed
    if (!isPasswordVerified) {
      return NextResponse.json(
        { status: false, message: 'Incorrect email or password.' },
        { status: 404 }
      );
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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          profilePicture: user.profilePicture,
          emailVerified: user.emailVerified,
          subscription: user.subscription,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
