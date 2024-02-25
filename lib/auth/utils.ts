import { RegisterConfirmEmail } from "@/emails/register-confirm-email";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import prisma from "@/lib/data/db";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

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

// TODO: Implement this function
export const verificationCodeIsValid = async (code: string) => {};
