import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/db/db';
import User from '~/models/user';
import { comparePassword, hashPassword, validateUser } from '~/utils/helper';
import { userUpdatePasswordMail } from '~/utils/emailHandler/emailHandler';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Validate user from session or token (from `validateUser` function)
    let user = await validateUser();

    if (!user) {
      return NextResponse.json(
        { status: false, message: 'User not authenticated.' },
        { status: 401 }
      );
    }

    // Parse the request body
    const data = await req.json();
    const { oldPassword, newPassword } = data;

    // Check if all fields are provided and passwords match
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        {
          status: false,
          message: 'Please provide all fields.',
        },
        { status: 400 }
      );
    }

    // Verify the old password
    const isPasswordCorrect = await comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { status: false, message: 'Old password is incorrect.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password in the database
    await User.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
    });
    // Sending reset password link on mail
    await userUpdatePasswordMail(user.email);
    return NextResponse.json(
      {
        status: true,
        message: 'Password changed successfully.',
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
