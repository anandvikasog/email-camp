import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '~/utils/helper';
import ConnectedEmail from '~/models/connectedEmail';
import axios from 'axios';

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
    const { token } = data;

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Something went wrong.' },
        { status: 400 }
      );
    }

    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // The response data will contain user information, including their email
    const { userPrincipalName, mail } = response.data;
    const email = userPrincipalName || mail;

    if (!email) {
      return NextResponse.json(
        { status: false, message: 'Something went wrong.' },
        { status: 400 }
      );
    }

    // checking is email is already connected
    const isAlreadyExists = await ConnectedEmail.findOne({
      emailId: email,
      userId: user._id,
      type: 'outlook',
    });
    let connectedEmail;
    if (isAlreadyExists) {
      connectedEmail = await ConnectedEmail.findByIdAndUpdate(
        isAlreadyExists._id,
        {
          type: 'outlook',
          outlookToken: token,
        },
        {
          new: true,
        }
      );
    } else {
      connectedEmail = new ConnectedEmail({
        userId: user._id,
        emailId: email,
        type: 'outlook',
        outlookToken: token,
      });
      await connectedEmail.save();
    }

    return NextResponse.json(
      {
        status: true,
        message: 'Outlook Id connected',
        data: connectedEmail,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log('error', e);
    return NextResponse.json(
      { status: false, message: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
