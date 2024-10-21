import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
import User from '~/models/user';
import { paths } from '@/paths';
import { redirect } from 'next/navigation';
import { google } from 'googleapis';
import axios from 'axios';
import nodemailer from 'nodemailer';

// this will return session cookie name as per dev/prod mode
export const getSessionCookieName = () => {
  return process.env.NODE_ENV === 'development'
    ? 'next-auth.session-token'
    : '__Secure-next-auth.session-token';
};

// This will encrypt givien data (object) using JWT - return encrypted string
export const encryptText = async (data: object) => {
  const token = jwt.sign(data, process.env.JWT_KEY || '', {
    expiresIn: '1d',
  });
  return token;
};

// This will decrypt givien JWT encrypted data (string) - return data object
export const decryptText = async (token: string) => {
  const data: any = await jwt.verify(token, process.env.JWT_KEY || '');
  // @ts-ignore
  return data;
};

// This will create a hash of password - return hashed string
export const hashPassword = async (password: string) => {
  let hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// This will compare a hashed and unhashed password - return boolean
export const comparePassword = async (
  passRecieved: string,
  passInDB: string
) => {
  return await bcrypt.compare(passRecieved, passInDB);
};

// This will create a buffer for given file object - return butfer
export const getFileBuffer = async (file: any) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};

// This will validate the given next-auth session - return user data or false
export const validateSession = async (sessionToken: string) => {
  const tokenData: any = await decode({
    token: sessionToken,
    secret: process.env.JWT_KEY || '',
  });

  if (!tokenData || !tokenData?._id) {
    return false;
  }

  const user = await User.findById(tokenData._id);
  if (!user) {
    return false;
  }
  return user;
};

// This will check weather the user has session or not - return user data or false
export const validateUser = async () => {
  const sessionToken: any = cookies().get(getSessionCookieName());
  if (!sessionToken || !sessionToken?.value) {
    cookies().delete(getSessionCookieName());
    redirect(paths.public.signIn);
  }

  const isValid = await validateSession(sessionToken.value);

  if (!isValid) {
    cookies().delete(getSessionCookieName());
    redirect(paths.public.signIn);
  }

  return isValid;
};

// send email using gmail
export async function sendEmailUsingGmail(
  accessToken: string,
  recipient: string,
  subject: string,
  htmlMessage: string
) {
  // Initialize the OAuth2 client
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  // Initialize the Gmail API
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Create the email message with HTML content
  const encodedMessage = Buffer.from(
    `To: ${recipient}\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/html; charset="UTF-8"\r\n` +
      `\r\n` +
      htmlMessage
  )
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Send the email
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  return true;
}

export async function sendEmailUsingOutlook(
  accessToken: string,
  recipient: string,
  subject: string,
  htmlMessage: string
) {
  const emailData = {
    message: {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: htmlMessage,
      },
      toRecipients: [
        {
          emailAddress: {
            address: recipient,
          },
        },
      ],
    },
  };

  const response = await axios.post(
    'https://graph.microsoft.com/v1.0/me/sendMail',
    emailData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return true;
}

export async function sendEmailUsingCustomSmtp(
  smtpData: any,
  recipient: string,
  subject: string,
  htmlMessage: string
) {
  const { smtpHost, smtpPort, smtpUsername, smtpPassword, emailId } = smtpData;
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUsername,
      pass: smtpPassword,
    },
  });

  const res = await transporter.sendMail({
    from: emailId,
    to: recipient,
    subject: subject,
    html: htmlMessage,
  });
  return true;
}
