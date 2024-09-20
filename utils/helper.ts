import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
import User from '~/models/user';
import { paths } from '@/paths';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';

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
  const data: any = await jwt.verify(
    token,
    process.env.JWT_KEY || ''
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

// cloudinary --
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const options: any = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  resource_type: 'auto',
};

// upload image to cloudinary
export const uploadImageToCloudinary = async (
  imageBuffer: Buffer,
  fileName: string
) => {
  options.public_id = fileName;
  const value = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url);
        }
      })
      .end(imageBuffer);
  });
  return value;
};

// delete image from cloudinary
export const deleteImageFromCloudinary = async (imageUrl: string) => {
  // @ts-ignore
  const publicId = imageUrl.split('/').pop().split('.')[0];
  const result = await cloudinary.uploader.destroy(publicId);
  const { result: value } = result;
  return value === 'ok' ? true : value;
};
