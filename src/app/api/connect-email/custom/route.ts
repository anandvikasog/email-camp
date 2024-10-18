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
    const {
      email,
      smtpHost,
      smtpPort,
      smtpUsername,
      imapHost,
      imapPort,
      imapUsername,
      smtpPassword,
      imapPassword,
    } = data;

    if (
      !email ||
      !smtpHost ||
      !smtpPort ||
      !smtpUsername ||
      !imapHost ||
      !imapPort ||
      !imapUsername ||
      !smtpPassword ||
      !imapPassword
    ) {
      return NextResponse.json(
        { status: false, message: 'Something went wrong.' },
        { status: 400 }
      );
    }

    // checking is email is already connected
    const isAlreadyExists = await ConnectedEmail.findOne({
      emailId: email,
      userId: user._id,
      type: 'custom',
    });
    let connectedEmail;
    if (isAlreadyExists) {
      connectedEmail = await ConnectedEmail.findByIdAndUpdate(
        isAlreadyExists._id,
        {
          type: 'custom',
          smtpHost,
          smtpPort,
          smtpUsername,
          imapHost,
          imapPort,
          imapUsername,
          smtpPassword,
          imapPassword,
        },
        {
          new: true,
        }
      );
    } else {
      connectedEmail = new ConnectedEmail({
        userId: user._id,
        emailId: email,
        type: 'custom',
        smtpHost,
        smtpPort,
        smtpUsername,
        imapHost,
        imapPort,
        imapUsername,
        smtpPassword,
        imapPassword,
      });
      await connectedEmail.save();
    }

    return NextResponse.json(
      {
        status: true,
        message: 'Custom Id connected',
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
