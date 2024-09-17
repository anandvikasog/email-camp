import { NextRequest, NextResponse } from "next/server";
import dbConnect from "~/db/db";
import User from "~/models/user";
import { userResetPasswordLinkMail } from "~/utils/emailHandler/emailHandler";
import { encryptText } from "~/utils/helper";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json(
        { status: false, message: "Please provide email." },
        { status: 400 }
      );
    }

    // Checking email is registered or not
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: "Email not registered.",
        },
        { status: 400 }
      );
    }

    // Checking email is verified or not
    if (!user.emailVerified) {
      return NextResponse.json(
        { status: false, message: "Please verify your email first." },
        { status: 400 }
      );
    }

    // If "resetPasswordToken" already exists, that means , reset password is already requested before
    if (user.resetPasswordToken) {
      return NextResponse.json(
        {
          status: false,
          message: "Reset password link is already sent.",
        },
        { status: 400 }
      );
    }

    const linkToken = await encryptText({ id: user._id });
    await User.findByIdAndUpdate(user._id, { resetPasswordToken: linkToken });

    // Sending reset password link on mail
    await userResetPasswordLinkMail(user.email, linkToken);

    return NextResponse.json(
      {
        status: true,
        message: "Reset password link is sent on your email ID.",
        email,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { status: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
