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

    if (!reqData.email || !reqData.password || !reqData.firstName) {
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

      // Saving image in cloudinary
      const profilePictureUrl = await uploadImageToCloudinary(
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
          profilePicture: user.profilePicture,
         
          gender: user.gender,
          about: user.about,
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

    // Assuming user ID is available through some auth context
    const userId = multipartData.get('userId');
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required.' },
        { status: 400 }
      );
    }

    const reqData = {
      firstName: multipartData.get('firstName'),
      lastName: multipartData.get('lastName'),

      mobile: multipartData.get('mobile'),
      gender: multipartData.get('gender'),
      about: multipartData.get('about'),
    };

    // Validate required fields
    if (!reqData.firstName) {
      return NextResponse.json(
        { message: 'Please provide required fields.' },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await User.findByIdAndUpdate(userId, reqData, {
      new: true,
    });
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 409 });
    }

    // // Handle profile picture upload
    // const profilePicture = multipartData.get('profilePicture');
    // if (profilePicture) {
    //   const buffer = await getFileBuffer(profilePicture);
    //   reqData.profilePicture = await uploadImageToCloudinary(buffer, `avatar_${Date.now()}`);
    // }

    // Return updated user details (excluding password)
    return NextResponse.json(
      {
        status: true,
        message: 'User updated successfully.',
        data: {
          _id: existingUser._id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,

          mobile: existingUser.mobile,
          gender: existingUser.gender,
          about: existingUser.about,
          // profilePicture: updatedUser.profilePicture,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    // Log the error for debugging
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
