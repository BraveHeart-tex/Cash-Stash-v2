import { RegisterConfirmEmail } from "@/emails/register-confirm-email";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import prisma from "@/lib/data/db";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { User } from "@prisma/client";
import {
  PAGE_ROUTES,
  EMAIL_VERIFICATION_CODE_EXPIRY_MINUTES,
  EMAIL_VERIFICATION_CODE_LENGTH,
  FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES,
} from "@/lib/constants";
import { generateId } from "lucia";
import ForgotPasswordEmail from "@/emails/forgot-password-email";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string
): Promise<string> => {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });

  const code = generateRandomString(
    EMAIL_VERIFICATION_CODE_LENGTH,
    alphabet("0-9")
  );
  await prisma.emailVerificationCode.create({
    data: {
      userId,
      email,
      code,
      expiresAt: createDate(
        new TimeSpan(EMAIL_VERIFICATION_CODE_EXPIRY_MINUTES, "m")
      ),
    },
  });

  return code;
};

export const sendEmailVerificationCode = async (
  email: string,
  code: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT!),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailHTML = render(
    RegisterConfirmEmail({
      validationCode: code,
      validationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${PAGE_ROUTES.EMAIL_VERIFICATION_ROUTE}/${email}`,
    })
  );

  const options = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirm your email address",
    html: emailHTML,
  };

  await transporter.sendMail(options);
};

export const sendResetPasswordLink = async (email: string, url: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT!),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailHTML = render(
    ForgotPasswordEmail({
      url,
    })
  );

  const options = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your password",
    html: emailHTML,
  };

  await transporter.sendMail(options);
};

export const verifyVerificationCode = async (user: User, code: string) => {
  const emailVerificationCode = await prisma.emailVerificationCode.findFirst({
    where: {
      userId: user.id,
      code,
    },
  });

  if (!emailVerificationCode) {
    return false;
  }

  if (!isWithinExpirationDate(emailVerificationCode.expiresAt)) {
    return false;
  }

  if (emailVerificationCode.email !== user.email) {
    return false;
  }

  return true;
};

export const deleteEmailVerificationCode = async (userId: string) => {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });
};

export const createPasswordResetToken = async (userId: string) => {
  await prisma.passwordResetToken.deleteMany({
    where: {
      user_id: userId,
    },
  });

  const tokenId = generateId(40);
  await prisma.passwordResetToken.create({
    data: {
      id: tokenId,
      user_id: userId,
      expires_At: createDate(
        new TimeSpan(FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES, "m")
      ),
    },
  });

  return tokenId;
};
