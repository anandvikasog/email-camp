import { NextRequest, NextResponse } from "next/server";
import dbConnect from "~/db/db";
import User from "~/models/user";
import { decryptText, hashPassword } from "~/utils/helper";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { password, token } = data;

    if (!password || !token) {
      return NextResponse.json(
        { status: false, message: "Please provide required data." },
        { status: 400 }
      );
    }

    const tokenData: any = await decryptText(token);
    if (!tokenData || !tokenData?.id) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({
      _id: tokenData.id,
      resetPasswordToken: token,
    });

    if (!user) {
      return NextResponse.json(
        { status: false, message: "User not found" },
        { status: 404 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await User.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
      $unset: { resetPasswordToken: 1 },
    });

    return NextResponse.json(
      {
        status: true,
        message: "Password changed successfully.",
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
