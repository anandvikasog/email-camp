import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
import User from '~/models/user';
import { paths } from '@/paths';
import { redirect } from 'next/navigation';

// This will encrypt givien data (object) using JWT - return encrypted string
export const encryptText = async (data: object) => {
  const token = jwt.sign(data, process.env.NEXT_PUBLIC_JWT_KEY || '');
  return token;
};

// This will decrypt givien JWT encrypted data (string) - return data object
export const decryptText = async (token: string) => {
  const data: any = await jwt.verify(
    token,
    process.env.NEXT_PUBLIC_JWT_KEY || ''
  );
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
    secret: process.env.NEXT_PUBLIC_JWT_KEY || '',
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
  const sessionToken: any = cookies().get('next-auth.session-token');
  if (!sessionToken || !sessionToken?.value) {
    cookies().delete('next-auth.session-token');
    redirect(paths.public.signIn);
  }

  const isValid = await validateSession(sessionToken.value);

  if (!isValid) {
    cookies().delete('next-auth.session-token');
    redirect(paths.public.signIn);
  }

  return isValid;
};
