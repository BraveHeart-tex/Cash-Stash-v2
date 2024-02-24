import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import prisma from "@/lib/data/db";

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

// TODO: Implement this function
export const sendEmailVerificationCode = async (
  email: string,
  code: string
) => {};

// TODO: Implement this function
export const verificationCodeIsValid = async (code: string) => {};
