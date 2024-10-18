import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '~/utils/helper';
import { google } from 'googleapis';
import ConnectedEmail from '~/models/connectedEmail';

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

    // Initialize the OAuth2 client
    const oauth2Client = new google.auth.OAuth2();

    // Set the access token
    oauth2Client.setCredentials({
      access_token: token,
    });

    // Initialize the OAuth2 API
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    // Make a request to get user info
    const userInfo = await oauth2.userinfo.get();

    if (!userInfo) {
      return NextResponse.json(
        { status: false, message: 'Something went wrong.' },
        { status: 400 }
      );
    }

    const { email } = userInfo.data;

    // checking is email is already connected
    const isAlreadyExists = await ConnectedEmail.findOne({
      emailId: email,
      userId: user._id,
      type: 'gmail',
    });
    let connectedEmail;
    if (isAlreadyExists) {
      connectedEmail = await ConnectedEmail.findByIdAndUpdate(
        isAlreadyExists._id,
        {
          type: 'gmail',
          gmailToken: token,
        },
        {
          new: true,
        }
      );
    } else {
      connectedEmail = new ConnectedEmail({
        userId: user._id,
        emailId: email,
        type: 'gmail',
        gmailToken: token,
      });
      await connectedEmail.save();
    }

    return NextResponse.json(
      {
        status: true,
        message: 'Gmail Id connected',
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
