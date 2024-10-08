"use server";

import {
  EMAIL_VERIFICATION_CODE_EXPIRY_MINUTES,
  EMAIL_VERIFICATION_CODE_LENGTH,
} from "@/lib/constants";
import { db } from "@/lib/database/connection";
import {
  type UserSelectModel,
  emailVerificationCode,
} from "@/lib/database/schema";
import { convertToMysqlDateTime } from "@/lib/utils/dateUtils/convertToMysqlDateTime";
import { and, eq } from "drizzle-orm";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string,
): Promise<string> => {
  await db
    .delete(emailVerificationCode)
    .where(eq(emailVerificationCode.userId, userId));

  const code = generateRandomString(
    EMAIL_VERIFICATION_CODE_LENGTH,
    alphabet("0-9"),
  );

  await db.insert(emailVerificationCode).values({
    userId,
    email,
    code,
    expiresAt: convertToMysqlDateTime(
      createDate(
        new TimeSpan(EMAIL_VERIFICATION_CODE_EXPIRY_MINUTES, "m"),
      ).toISOString(),
    ),
  });

  return code;
};

export const verifyVerificationCode = async (
  user: UserSelectModel,
  code: string,
) => {
  const [verificationCode] = await db
    .select()
    .from(emailVerificationCode)
    .where(
      and(
        eq(emailVerificationCode.userId, user.id),
        eq(emailVerificationCode.code, code),
      ),
    );

  if (!verificationCode) {
    return false;
  }

  if (!isWithinExpirationDate(new Date(verificationCode.expiresAt))) {
    return false;
  }

  return verificationCode.email === user.email;
};

export const deleteEmailVerificationCode = async (userId: string) => {
  return db
    .delete(emailVerificationCode)
    .where(eq(emailVerificationCode.userId, userId));
};
