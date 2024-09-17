import { NextRequest, NextResponse } from "next/server";
import dbConnect from "~/db/db";
import User from "~/models/user";
import { comparePassword, encryptText } from "~/utils/helper";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { email, password } = data;

    // Login failed
    if (!email || !password) {
      return NextResponse.json(
        { status: false, message: "Please provide email and password." },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email,
    });

    // Login failed
    if (!user) {
      return NextResponse.json(
        { status: false, message: "Incorrect email or password." },
        { status: 404 }
      );
    }

    // Login failed
    if (!user.emailVerified) {
      return NextResponse.json(
        { status: false, message: "Please verify your email first." },
        { status: 400 }
      );
    }

    const isPasswordVerified = await comparePassword(password, user.password);

    // Login failed
    if (!isPasswordVerified) {
      return NextResponse.json(
        { status: false, message: "Incorrect email or password." },
        { status: 404 }
      );
    }

    const { _id, fullName, phone, avatar } = user;
    const token = await encryptText({ id: _id });

    // Login Success
    return NextResponse.json(
      {
        status: true,
        message: "Logged in successfully.",
        token,
        data: {
          _id,
          email,
        },
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
