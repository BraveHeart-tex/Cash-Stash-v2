import { RegisterConfirmEmail } from "@/emails/register-confirm-email";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
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
import emailService from "@/lib/services/emailService";
import { db } from "@/lib/database/connection";
import {
  emailVerificationCode,
  passwordResetTokens,
} from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { convertIsoToMysqlDatetime } from "@/lib/utils";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string
): Promise<string> => {
  await db
    .delete(emailVerificationCode)
    .where(eq(emailVerificationCode.userId, userId));

  const code = generateRandomString(
    EMAIL_VERIFICATION_CODE_LENGTH,
    alphabet("0-9")
  );

  await db.insert(emailVerificationCode).values({
    userId,
    email,
    code,
    expiresAt: convertIsoToMysqlDatetime(
      createDate(
        new TimeSpan(EMAIL_VERIFICATION_CODE_EXPIRY_MINUTES, "m")
      ).toISOString()
    ),
  });

  return code;
};

export const sendEmailVerificationCode = async (
  email: string,
  code: string
) => {
  const emailHTML = render(
    RegisterConfirmEmail({
      validationCode: code,
      validationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${PAGE_ROUTES.EMAIL_VERIFICATION_ROUTE}/${email}`,
    })
  );

  const options = {
    from: process.env.EMAIL_USER!,
    to: email,
    subject: "Confirm your email address",
    html: emailHTML,
  };

  await emailService.sendEmail(options);
};

export const sendResetPasswordLink = async (email: string, url: string) => {
  const emailHTML = render(
    ForgotPasswordEmail({
      url,
    })
  );

  const options = {
    from: process.env.EMAIL_USER!,
    to: email,
    subject: "Reset your password",
    html: emailHTML,
  };

  await emailService.sendEmail(options);
};

export const verifyVerificationCode = async (user: User, code: string) => {
  const [verificationCode] = await db
    .select()
    .from(emailVerificationCode)
    .where(
      and(
        eq(emailVerificationCode.userId, user.id),
        eq(emailVerificationCode.code, code)
      )
    );

  if (!emailVerificationCode) {
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

export const createPasswordResetToken = async (userId: string) => {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));

  const tokenId = generateId(40);
  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt: convertIsoToMysqlDatetime(
      createDate(
        new TimeSpan(FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES, "m")
      ).toISOString()
    ),
  });

  return tokenId;
};
