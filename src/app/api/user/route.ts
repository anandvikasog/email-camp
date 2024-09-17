import dbConnect from '~/db/db';
import User from '~/models/user';
import { NextResponse, NextRequest } from 'next/server';
import { encryptText, hashPassword } from '~/utils/helper';
import { userEmailVerificationMail } from '~/utils/emailHandler/emailHandler';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { email, password } = data;

    // Checking is email already taken
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return NextResponse.json(
        { message: 'Email already registered.' },
        { status: 409 }
      );
    }
    // Hashing password
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const linkToken = await encryptText({ id: newUser._id });

    // Verification mail
    await userEmailVerificationMail(newUser.email, linkToken);
    return NextResponse.json(
      {
        status: true,
        message:
          'User created, email verification link is sent on registered email ID.',
        email,
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
