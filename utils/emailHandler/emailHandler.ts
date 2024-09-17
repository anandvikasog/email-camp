import { paths } from "@/paths";
import sgMail from "@sendgrid/mail";
import MailLog from "~/models/mailLog";
import { resetPasswordLinkTemplate } from "./emailTemplates/reset";
import { emailVerificationTemplate } from "./emailTemplates/verify";

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "");

let emailVerifyPageUrl: string = paths.public.emailVerify;
if (emailVerifyPageUrl[0] === "/") {
  emailVerifyPageUrl = emailVerifyPageUrl.slice(1, emailVerifyPageUrl.length);
}

let resetPasswordPage: string = paths.public.resetPassword;
if (resetPasswordPage[0] === "/") {
  resetPasswordPage = resetPasswordPage.slice(1, resetPasswordPage.length);
}

export const sentMail = async (
  toMail: string,
  subject: string,
  html: string = ""
) => {
  const msg = {
    to: toMail,
    from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL || "",
    subject,
    html,
  };
  try {
    const mailResponse = await sgMail.send(msg);
    if (mailResponse[0]?.statusCode) {
      const newMailLog = new MailLog({
        from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL,
        to: toMail,
        subject,
        body: html,
      });
      try {
        await newMailLog.save();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("Failed to save mail log!");
      }
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log("Error while sending mail!");
    throw new Error(error);
  }
};

export const userEmailVerificationMail = async (
  email: string,
  token: string
) => {
  try {
    const link = `${process.env.NEXT_PUBLIC_APP_URL}${emailVerifyPageUrl}?code=${token}`;
    await sentMail(email, "Verify Your Email", emailVerificationTemplate(link));
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
    await sentMail(
      email,
      "Reset Password Link",
      resetPasswordLinkTemplate(link)
    );
  } catch (error: any) {
    throw new Error(error);
  }
};
