import { RegisterConfirmEmail } from "@/emails/register-confirm-email";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import prisma from "@/lib/data/db";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { User } from "@prisma/client";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string
): Promise<string> => {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });

  const code = generateRandomString(8, alphabet("0-9"));
  await prisma.emailVerificationCode.create({
    data: {
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(5, "m")),
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

export const resendEmailVerificationCode = async (email: string) => {
  console.log("Resending email verification code", email);
};

export const deleteEmailVerificationCode = async (userId: string) => {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });
};
