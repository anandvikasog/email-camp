import { paths } from '@/paths';
import { resetPasswordLinkTemplate } from './emailTemplates/reset';
import { emailVerificationTemplate } from './emailTemplates/verify';
import { updatePasswordTemplate } from './emailTemplates/password';
import { sendSingleEmail } from '../aws';

let emailVerifyPageUrl: string = paths.common.emailVerify;
if (emailVerifyPageUrl[0] === '/') {
  emailVerifyPageUrl = emailVerifyPageUrl.slice(1, emailVerifyPageUrl.length);
}

let resetPasswordPage: string = paths.public.resetPassword;
if (resetPasswordPage[0] === '/') {
  resetPasswordPage = resetPasswordPage.slice(1, resetPasswordPage.length);
}

export const userEmailVerificationMail = async (
  email: string,
  token: string
) => {
  try {
    const link = `${process.env.NEXT_PUBLIC_APP_URL}${emailVerifyPageUrl}?code=${token}`;
    await sendSingleEmail(
      process.env.OFFICIAL_FROM_MAIL,
      email,
      'Verify Your Email',
      emailVerificationTemplate(link)
    );
  } catch (error: any) {
    throw new Error(error);
  }
};

export const userResetPasswordLinkMail = async (
  email: string,
  token: string
) => {
  try {
    const link = `${process.env.NEXT_PUBLIC_APP_URL}${resetPasswordPage}?code=${token}`;
    await sendSingleEmail(
      process.env.OFFICIAL_FROM_MAIL,
      email,
      'Reset Password Link',
      resetPasswordLinkTemplate(link)
    );
  } catch (error: any) {
    throw new Error(error);
  }
};

export const userUpdatePasswordMail = async (email: string) => {
  try {
    await sendSingleEmail(
      process.env.OFFICIAL_FROM_MAIL,
      email,
      'Your Password Has Been Successfully Updated',
      updatePasswordTemplate()
    );
  } catch (error: any) {
    throw new Error(error);
  }
};
