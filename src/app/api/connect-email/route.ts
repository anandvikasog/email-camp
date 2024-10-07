import { NextRequest, NextResponse } from 'next/server';
import ConnectedEmail from '~/models/connectedEmail';
import { checkEmailListVerificationStatus } from '~/utils/aws';
import { verifyEmailAddress } from '~/utils/aws';
import { validateUser } from '~/utils/helper';

export async function POST(req: NextRequest) {
  try {
    const user = await validateUser();
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: 'Unauthorised.',
        },
        { status: 401 }
      );
    }
    const data = await req.json();
    const { email, domain } = data;

    // checking is email is already connected
    const isAlreadyExists = await ConnectedEmail.findOne({ emailId: email });
    if (isAlreadyExists) {
      return NextResponse.json(
        {
          status: false,
          message: 'Email already exists.',
        },
        { status: 409 }
      );
    }

    const result = await verifyEmailAddress(email);
    if (!result?.status) {
      return NextResponse.json(
        {
          status: false,
          message: 'Somthing went wrong while verifying the email.',
        },
        { status: 500 }
      );
    }

    const newConnectedEmail = new ConnectedEmail({
      userId: user._id,
      emailId: email,

      domain,
    });

    await newConnectedEmail.save();
    return NextResponse.json(
      {
        status: true,
        message: `A verification email is sent on ${email}.`,
        ConnectedEmail: newConnectedEmail._id,
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
    const user = await validateUser();
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: 'Unauthorized.',
        },
        { status: 401 }
      );
    }

    // Get all connected emails for this user
    const connectedEmails = await ConnectedEmail.find({ userId: user._id });

    // Extract the email list
    const emailList = connectedEmails.map((emailObj) => emailObj.emailId);

    // Check the verification status of the email list in AWS SES
    const emailStatuses = await checkEmailListVerificationStatus(emailList);

    return NextResponse.json(
      {
        status: true,
        data: emailStatuses,
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
    const user = await validateUser();
    if (!user) {
      return NextResponse.json(
        {
          status: false,
          message: 'Unauthorised.',
        },
        { status: 401 }
      );
    }
    const data = await req.json();
    const { id, signature } = data;

    // Check if the connected email exists for the user by id
    let connectedEmail = await ConnectedEmail.findOne({
      _id: id,
      userId: user._id,
    });
    if (!connectedEmail) {
      return NextResponse.json(
        {
          status: false,
          message: 'Connected email not found.',
        },
        { status: 404 }
      );
    }

    const emailList = [connectedEmail.emailId];
    // Check the verification status of the email list in AWS SES
    await checkEmailListVerificationStatus(emailList);

    // Refetch the connected email to ensure it's updated
    connectedEmail = await ConnectedEmail.findOne({
      _id: id,
      userId: user._id,
    });

    // Check if the email is verified
    if (!connectedEmail.verified) {
      return NextResponse.json(
        {
          status: false,
          message: 'Email is not verified. Cannot update the signature.',
        },
        { status: 403 } // Forbidden status code
      );
    }

    // Update the signature
    connectedEmail.signature = signature;
    await connectedEmail.save();

    return NextResponse.json(
      {
        status: true,
        message: `Signature updated successfully.`,
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
