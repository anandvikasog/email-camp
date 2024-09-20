import dbConnect from '~/db/db';
import User from '~/models/user';
import { NextResponse, NextRequest } from 'next/server';
import { encryptText } from '~/utils/helper';
import { userEmailVerificationMail } from '~/utils/emailHandler/emailHandler';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { userId } = data;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not exists.' },
        { status: 404 }
      );
    }

    const token = await encryptText({ id: user._id });

    // Verification mail
    await userEmailVerificationMail(user.email, token);

    // Login Success
    return NextResponse.json(
      {
        status: true,
        message: 'Verification mail send.',
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
