import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '~/db/db';
import { validateSession } from '~/utils/helper';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const { sessionToken } = data;
    const isValid = await validateSession(sessionToken);
    if (!isValid) {
      return NextResponse.json({ status: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        status: true,
        data: {
          _id: isValid._id,
          firstName: isValid.firstName,
          lastName: isValid.lastName,
          email: isValid.email,
          mobile: isValid.mobile,
          countryCode: isValid.countryCode,
          about: isValid.about,
          companyName: isValid.companyName,
          gender: isValid.gender,
          createdAt: isValid.createdAt,
          profilePicture: isValid.profilePicture,
          emailVerified: isValid.emailVerified,
          subscription: isValid.subscription,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
