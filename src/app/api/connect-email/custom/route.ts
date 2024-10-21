import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '~/utils/helper';
import ConnectedEmail from '~/models/connectedEmail';
import nodemailer from 'nodemailer';
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

    // Validate SMTP credentials by sending a test email
    const testEmailResult = await sendTestEmail({
      smtpHost,
      smtpPort,
      smtpUsername,
      smtpPassword,
      fromEmail: email, // Use user's email as the sender address to test validity
      toEmail: 'ram.agarwal@ongraph.com', // Test email sent to a hardcoded test email address
    });

    if (!testEmailResult.success) {
      return NextResponse.json(
        {
          status: false,
          message: 'Invalid SMTP credentials: ' + testEmailResult.message,
        },
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

// Helper function to send a test email to validate SMTP credentials
async function sendTestEmail({
  smtpHost,
  smtpPort,
  smtpUsername,
  smtpPassword,
  fromEmail,
  toEmail,
}: {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string; // This is the user's provided email
  toEmail: string; // Sending to test email (e.g., 'test@yopmail.com')
}): Promise<{ success: boolean; message?: string }> {
  try {
    // Create a Nodemailer transporter with the user's SMTP credentials
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
      connectionTimeout: 10000, // optional: increase the connection timeout
      socketTimeout: 10000, // optional: increase the socket timeout
    });

    // Send a test email to check if the SMTP connection works
    await transporter.sendMail({
      from: fromEmail, // Sender address (user's email)
      to: toEmail, // Receiver's address (test email like yopmail)
      subject: 'SMTP Test Email', // Subject line
      text: 'This is a test email to verify your SMTP credentials.', // Plain text body
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error sending test email:', error);
    return { success: false, message: error.message };
  }
}
