import dbConnect from '~/db/db';
import User from '~/models/user';
import { NextResponse, NextRequest } from 'next/server';
import {
  encryptText,
  getFileBuffer,
  hashPassword,
  validateUser,
} from '~/utils/helper';
import { userEmailVerificationMail } from '~/utils/emailHandler/emailHandler';
import { uploadToS3 } from '~/utils/aws';

type UserUpdateData = {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  gender?: string;
  about?: string;
  companyName?: string;
  companyCode?: string;
  countryCode?: string;
  profilePicture?: File | string; // Can be a File (before upload) or a string (URL after upload)
};

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
      countryCode: multipartData.get('countryCode'),
      companyName: multipartData.get('companyName'),
      profilePicture: '',
    };

    if (
      !reqData.email ||
      !reqData.password ||
      !reqData.firstName ||
      !reqData.companyName
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

    const profilePicture = multipartData.get('profilePicture');
    if (profilePicture) {
      const buffer = await getFileBuffer(profilePicture);

      // Saving image in S3
      const profilePictureUrl = await uploadToS3(
        buffer,
        `avatar_${Date.now()}`
      );
      if (profilePictureUrl) {
        reqData.profilePicture = profilePictureUrl as string;
      }
    }

    const newUser = new User(reqData);

    await newUser.save();
    const token = await encryptText({ id: newUser._id });

    // Verification mail
    await userEmailVerificationMail(newUser.email, token);

    // Login Success
    return NextResponse.json(
      {
        status: true,
        message: 'Registered successfully.',
        token,
        data: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          mobile: newUser.mobile,
          profilePicture: newUser.profilePicture,
          companyName: newUser.companyName,
          emailVerified: newUser.emailVerified,
          subscription: newUser.subscription,
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

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract the userId from the query parameters
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required.' },
        { status: 400 }
      );
    }

    // Find the user by ID
    const user = await User.findById(userId).select('-password'); // Excluding the password field

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Return user details
    return NextResponse.json(
      {
        status: true,
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          countryCode: user.countryCode,
          profilePicture: user.profilePicture,
          companyName: user.companyName,
          gender: user.gender,
          about: user.about,
          createdAt: user.createdAt,
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

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const multipartData = await req.formData();

    let user = await validateUser();

    if (!user) {
      return NextResponse.json(
        { status: false, message: 'User not authenticated.' },
        { status: 401 }
      );
    }

    const userId = user._id;
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required.' },
        { status: 400 }
      );
    }

    // Initialize an empty object to store update data with defined type
    const reqData: UserUpdateData = {};

    // Check if there's a profile picture and handle the upload
    const profilePicture = multipartData.get('profilePicture');
    if (profilePicture) {
      const buffer = await getFileBuffer(profilePicture);
      const uploadedImageUrl = await uploadToS3(buffer, `avatar_${Date.now()}`);
      reqData.profilePicture = uploadedImageUrl;
    }

    // Collect other optional fields, but only if they exist in the request
    const firstName = multipartData.get('firstName') as string | null;
    const lastName = multipartData.get('lastName') as string | null;
    const mobile = multipartData.get('mobile') as string | null;
    const countryCode = multipartData.get('countryCode') as string | null;
    const gender = multipartData.get('gender') as string | null;
    const about = multipartData.get('about') as string | null;
    const companyName = multipartData.get('companyName') as string | null;

    // Add other fields to reqData only if they are provided
    if (firstName) reqData.firstName = firstName;
    if (lastName) reqData.lastName = lastName;
    if (mobile) reqData.mobile = mobile;
    if (countryCode) reqData.countryCode = countryCode;
    if (gender) reqData.gender = gender;
    if (about) reqData.about = about;
    if (companyName) reqData.companyName = companyName;

    // If no data to update, return an error
    if (Object.keys(reqData).length === 0) {
      return NextResponse.json(
        { message: 'No data provided to update.' },
        { status: 400 }
      );
    }

    // Update the user with the collected data
    const updatedUser = await User.findByIdAndUpdate(userId, reqData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Return updated user details
    return NextResponse.json(
      {
        status: true,
        message: 'User updated successfully.',
        data: {
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          mobile: updatedUser.mobile,
          countryCode: updatedUser.countryCode,
          gender: updatedUser.gender,
          about: updatedUser.about,
          profilePicture: updatedUser.profilePicture, // Return updated profile picture
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
