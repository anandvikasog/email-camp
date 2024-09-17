import dbConnect from '~/db/db';
import User from '~/models/user';
import { NextResponse, NextRequest } from 'next/server';
import {
  encryptText,
  getFileBuffer,
  hashPassword,
  uploadImageToCloudinary,
} from '~/utils/helper';
import { userEmailVerificationMail } from '~/utils/emailHandler/emailHandler';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const multipartData = await req.formData();

    const reqData = {
      firstName: multipartData.get('firstName'),
      lastName: multipartData.get('lastName'),
      email: multipartData.get('email'),
      password: multipartData.get('password'),
      mobile: multipartData.get('mobile'),
      profilePicture: '',
    };

    if (
      !reqData.email ||
      !reqData.password ||
      !reqData.firstName ||
      !reqData.lastName ||
      !reqData.mobile
    ) {
      return NextResponse.json(
        { message: 'Please provide all the required data.' },
        { status: 400 }
      );
    }

    // Checking is email already taken
    const isUserExists = await User.findOne({ email: reqData.email });
    if (isUserExists) {
      return NextResponse.json(
        { message: 'Email already registered.' },
        { status: 409 }
      );
    }

    // Hashing password
    reqData.password = await hashPassword(reqData.password as string);

    const avatar = multipartData.get('avatar');
    if (avatar) {
      const buffer = await getFileBuffer(avatar);

      // Saving image in cloudinary
      const avatarUrl = await uploadImageToCloudinary(
        buffer,
        `avatar_${Date.now()}`
      );
      if (avatarUrl) {
        reqData.profilePicture = avatarUrl as string;
      }
    }

    const newUser = new User(reqData);
    await newUser.save();
    const linkToken = await encryptText({ id: newUser._id });

    // Verification mail
    await userEmailVerificationMail(newUser.email, linkToken);
    return NextResponse.json(
      {
        status: true,
        message:
          'User created, email verification link is sent on registered email ID.',
        data: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          mobile: newUser.mobile,
          profilePicture: newUser.profilePicture,
          emailVerified: newUser.emailVerified,
          planPurchased: newUser.planPurchased,
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
