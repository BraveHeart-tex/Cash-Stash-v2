"use server";
import { getUser } from "@/lib/auth/session";
import { Argon2id } from "oslo/password";
import loginSchema, { LoginSchemaType } from "@/schemas/login-schema";
import registerSchema, { RegisterSchemaType } from "@/schemas/register-schema";
import { ZodError } from "zod";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createTOTPKeyURI, TOTPController } from "oslo/otp";
import { decodeHex, encodeHex } from "oslo/encoding";
import {
  checkRateLimit,
  checkIPBasedSendVerificationCodeRateLimit,
  checkSignUpRateLimit,
  checkUserIdBasedSendVerificationCodeRateLimit,
  verifyVerificationCodeRateLimit,
  verifyResetPasswordLinkRequestRateLimit,
  checkIpBasedTwoFactorAuthRateLimit,
  checkUserIdBasedTwoFactorAuthRateLimit,
} from "@/lib/redis/redisUtils";
import {
  EMAIL_VERIFICATION_REDIRECTION_PATHS,
  MAX_LOGIN_REQUESTS_PER_MINUTE,
  MAX_RESET_PASSWORD_LINK_REQUESTS_PER_MINUTE,
  MAX_SIGN_UP_REQUESTS_PER_MINUTE,
  MAX_TWO_FACTOR_AUTH_ATTEMPTS,
  MAX_VERIFICATION_CODE_ATTEMPTS,
  PAGE_ROUTES,
  SEND_VERIFICATION_CODE_RATE_LIMIT,
  getResetPasswordUrl,
} from "@/lib/constants";
import {
  createPasswordResetToken,
  generateEmailVerificationCode,
  sendEmailVerificationCode,
  sendResetPasswordLink,
  verifyVerificationCode,
} from "@/lib/auth/authUtils";
import { revalidatePath } from "next/cache";
import { isWithinExpirationDate } from "oslo";
import { IRecaptchaResponse } from "@/actions/types";
import { db, lucia } from "@/lib/database/connection";
import userRepository from "@/lib/database/repository/userRepository";
import emailVerificationCodeRepository from "@/lib/database/repository/emailVerificationCodeRepository";
import passwordResetTokenRepository from "@/lib/database/repository/passwordResetTokenRepository";
import twoFactorAuthenticationSecretRepository from "@/lib/database/repository/twoFactorAuthenticationSecretRepository";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import { twoFactorAuthenticationSecrets } from "@/lib/database/schema";
import { eq } from "drizzle-orm";

export const login = async (values: LoginSchemaType) => {
  const header = headers();
  const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
    ","
  )[0];
  const count = await checkRateLimit(ipAddress);

  if (count >= MAX_LOGIN_REQUESTS_PER_MINUTE) {
    return {
      error:
        "You have made too many requests. Please wait a minute before trying again.",
      fieldErrors: [],
      twoFactorAuthenticationRequired: false,
    };
  }

  try {
    const data = loginSchema.parse(values);

    const existingUser = await userRepository.getByEmail(data.email);

    if (!existingUser) {
      return {
        error: "Incorrect email or password",
        fieldErrors: [],
        twoFactorAuthenticationRequired: false,
      };
    }

    const isPasswordValid = await new Argon2id().verify(
      existingUser.hashedPassword,
      data.password
    );

    if (!isPasswordValid) {
      return {
        error: "Incorrect email or password",
        fieldErrors: [],
        twoFactorAuthenticationRequired: false,
      };
    }

    if (
      existingUser.prefersTwoFactorAuthentication &&
      existingUser.activatedTwoFactorAuthentication
    ) {
      return {
        error: null,
        fieldErrors: [],
        twoFactorAuthenticationRequired: true,
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      error: "",
      fieldErrors: [],
      twoFactorAuthenticationRequired: false,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return {
        ...processZodError(error),
        twoFactorAuthenticationRequired: false,
      };
    }

    return {
      error:
        "Something went wrong while processing your request. Please try again later.",
      fieldErrors: [],
      redirectPath: null,
      twoFactorAuthenticationRequired: false,
    };
  }
};

export const register = async (values: RegisterSchemaType) => {
  try {
    const data = registerSchema.parse(values);

    const userExists = await userRepository.getByEmail(data.email);

    if (userExists && !userExists.emailVerified) {
      const header = headers();
      const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
        ","
      )[0];
      const count = await checkSignUpRateLimit(userExists.id, ipAddress);

      if (count >= MAX_SIGN_UP_REQUESTS_PER_MINUTE) {
        return {
          error:
            "You have made too many requests. Please wait a minute before trying again.",
          fieldErrors: [],
        };
      }

      return {
        error: `User already exists with the given email. Please verify your email.`,
        fieldErrors: [
          {
            field: "email",
            message:
              "User already exists with the given email. Please verify your email.",
          },
        ],
      };
    }

    if (userExists) {
      return {
        error: `User already exists with the given email: ${data.email}`,
        fieldErrors: [
          {
            field: "email",
            message: "User already exists with the given email",
          },
        ],
      };
    }

    const hashedPassword = await new Argon2id().hash(data.password);
    const createUserResponse = await userRepository.createUser(
      {
        name: data.name,
        email: data.email,
        hashedPassword,
      },
      true
    );

    const { affectedRows, user } = createUserResponse;

    if (!user || affectedRows === 0) {
      return {
        error:
          "There was a problem while processing your request. Please try again later.",
        fieldErrors: [],
      };
    }

    const verificationCode = await generateEmailVerificationCode(
      user.id,
      user.email
    );

    await sendEmailVerificationCode(user.email, verificationCode);

    return {
      user,
      error: "",
      fieldErrors: [],
    };
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "Something went wrong while processing your request. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const logout = async () => {
  const result = await getUser();
  if (!result) {
    return {
      error: "Unauthorized",
    };
  }

  const { session } = result;
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect(PAGE_ROUTES.LOGIN_ROUTE);
};

export const checkEmailValidityBeforeVerification = async (email: string) => {
  try {
    const userWithEmail = await userRepository.getUnverifiedUserByEmail(email);

    if (!userWithEmail) {
      return {
        hasValidVerificationCode: false,
        timeLeft: 0,
      };
    }

    const verificationCode =
      await emailVerificationCodeRepository.getByEmailAndUserId(
        email,
        userWithEmail.id
      );

    if (!verificationCode) {
      return {
        hasValidVerificationCode: false,
        timeLeft: 0,
      };
    }

    return {
      hasValidVerificationCode: !!verificationCode,
      timeLeft: verificationCode?.expiresAt
        ? Math.floor(
            (new Date(verificationCode.expiresAt).getTime() - Date.now()) / 1000
          )
        : 0,
    };
  } catch (error) {
    console.error(error);
    return {
      hasValidVerificationCode: false,
      timeLeft: 0,
    };
  }
};

export const handleEmailVerification = async (email: string, code: string) => {
  try {
    const user = await userRepository.getUnverifiedUserByEmail(email);

    if (!user) {
      redirect(PAGE_ROUTES.LOGIN_ROUTE);
    }

    const isValid = await verifyVerificationCode(user, code);

    if (!isValid) {
      const header = headers();
      const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
        ","
      )[0];
      const verificationCount =
        await verifyVerificationCodeRateLimit(ipAddress);

      if (verificationCount >= MAX_VERIFICATION_CODE_ATTEMPTS) {
        await emailVerificationCodeRepository.deleteByUserId(user.id);
        return {
          error: "Too many attempts. Please wait before trying again.",
          successMessage: null,
          redirectPath: EMAIL_VERIFICATION_REDIRECTION_PATHS.TOO_MANY_REQUESTS,
        };
      }

      const triesLeft = MAX_VERIFICATION_CODE_ATTEMPTS - verificationCount;

      return {
        error:
          "Invalid verification code. You have " + triesLeft + " tries left",
        successMessage: null,
      };
    }

    await userRepository.updateUser(user.id, {
      emailVerified: 1,
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    await emailVerificationCodeRepository.deleteByUserId(user.id);

    return {
      error: null,
      successMessage:
        "Email verified successfully. You are being redirected...",
    };
  } catch (error) {
    console.error("Error while verifying email", error);
    return {
      error:
        "Something went wrong while processing your request. Please try again later.",
      successMessage: null,
    };
  }
};

export const resendEmailVerificationCode = async (email: string) => {
  const header = headers();
  const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
    ","
  )[0];
  const count = await checkIPBasedSendVerificationCodeRateLimit(ipAddress);
  if (count >= SEND_VERIFICATION_CODE_RATE_LIMIT) {
    return {
      message: "Too many requests. Please wait before trying again.",
      isError: true,
    };
  }

  const user = await userRepository.getUnverifiedUserByEmail(email);

  if (!user) {
    return {
      message:
        "If you have an account, an email has been sent to you. Please check your inbox. Make sure to check your spam folder",
      isError: false,
    };
  }

  const userIdBasedCount = await checkUserIdBasedSendVerificationCodeRateLimit(
    user.id
  );

  if (userIdBasedCount >= SEND_VERIFICATION_CODE_RATE_LIMIT) {
    return {
      message: "Too many requests. Please wait before trying again.",
      isError: true,
    };
  }

  const verificationCode = await generateEmailVerificationCode(
    user.id,
    user.email
  );

  await sendEmailVerificationCode(user.email, verificationCode);

  revalidatePath(PAGE_ROUTES.EMAIL_VERIFICATION_ROUTE + "/" + email, "layout");

  return {
    isError: false,
    message:
      "If you have an account, an email has been sent to you. Please check your inbox. Make sure to check your spam folder",
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  const header = headers();
  const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
    ","
  )[0];
  const count = await verifyResetPasswordLinkRequestRateLimit(ipAddress);
  if (count >= MAX_RESET_PASSWORD_LINK_REQUESTS_PER_MINUTE) {
    return {
      message: "Too many requests. Please wait before trying again.",
      isError: true,
    };
  }

  const user = await userRepository.getVerifiedUserByEmail(email);

  if (!user) {
    return {
      message:
        "If you have an account, an email has been sent to you. Please check your inbox. Make sure to check your spam folder",
      isError: false,
    };
  }

  const verificationToken = await createPasswordResetToken(user.id);
  const verificationLink = getResetPasswordUrl(email, verificationToken);

  await sendResetPasswordLink(email, verificationLink);

  return {
    isError: false,
    message:
      "If you have an account, an email has been sent to you. Please check your inbox. Make sure to check your spam folder",
  };
};

export const resetPassword = async ({
  email,
  token,
  password,
}: {
  email: string;
  token: string;
  password: string;
}) => {
  const user = await userRepository.getVerifiedUserByEmail(email);

  if (!user) {
    return {
      error: "Invalid request",
      successMessage: null,
    };
  }

  const resetToken = await passwordResetTokenRepository.getByToken(token);

  if (!resetToken || !isWithinExpirationDate(new Date(resetToken.expiresAt))) {
    return {
      error: "Invalid request",
      successMessage: null,
    };
  }

  await passwordResetTokenRepository.deleteByToken(token);

  await lucia.invalidateUserSessions(user.id);
  const hashedPassword = await new Argon2id().hash(password);

  await userRepository.updateUser(user.id, {
    hashedPassword,
  });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    error: null,
    successMessage: "Password reset successfully. You are being redirected...",
  };
};

export const enableTwoFactorAuthentication = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  await userRepository.updateUser(user.id, {
    prefersTwoFactorAuthentication: 1,
  });

  const twoFactorSecret = crypto.getRandomValues(new Uint8Array(20));

  await twoFactorAuthenticationSecretRepository.create({
    secret: encodeHex(twoFactorSecret),
    userId: user.id,
  });

  return createTOTPKeyURI("CashStash", user.email, twoFactorSecret);
};

export const activateTwoFactorAuthentication = async (otp: string) => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const result = await twoFactorAuthenticationSecretRepository.getByUserId(
    user.id
  );

  if (!result) {
    return {
      error: "Invalid request",
      successMessage: null,
    };
  }

  const isValid = await new TOTPController().verify(
    otp,
    decodeHex(result.secret)
  );

  if (!isValid) {
    return {
      error: "Invalid verification code",
      successMessage: null,
    };
  }

  await userRepository.updateUser(user.id, {
    activatedTwoFactorAuthentication: 1,
  });

  return {
    error: null,
    successMessage: "Two-factor authentication enabled successfully.",
  };
};

export const validateOTP = async (otp: string, email: string) => {
  const header = headers();
  const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
    ","
  )[0];
  const count = await checkIpBasedTwoFactorAuthRateLimit(ipAddress);

  if (count >= MAX_TWO_FACTOR_AUTH_ATTEMPTS) {
    return {
      error: "Too many attempts. You are being redirected to the login page.",
      successMessage: null,
      redirectPath: PAGE_ROUTES.LOGIN_ROUTE,
    };
  }

  const user = await userRepository.getByEmail(email);

  if (!user || !user?.prefersTwoFactorAuthentication) {
    return {
      error: "Invalid request",
      successMessage: null,
      redirectPath: null,
    };
  }

  const userIdBasedCount = await checkUserIdBasedTwoFactorAuthRateLimit(
    user.id
  );

  if (userIdBasedCount >= MAX_TWO_FACTOR_AUTH_ATTEMPTS) {
    return {
      error: "Too many attempts. You are being redirected to the login page.",
      successMessage: null,
      redirectPath: PAGE_ROUTES.LOGIN_ROUTE,
    };
  }

  const result = await twoFactorAuthenticationSecretRepository.getByUserId(
    user.id
  );

  if (!result) {
    return {
      error: "Invalid request",
      successMessage: null,
      redirectPath: PAGE_ROUTES.LOGIN_ROUTE,
    };
  }

  const isValid = await new TOTPController().verify(
    otp,
    decodeHex(result.secret)
  );

  if (!isValid) {
    const attemptsLeft = MAX_TWO_FACTOR_AUTH_ATTEMPTS - userIdBasedCount;
    return {
      error: `Invalid verification code. You have ${attemptsLeft} tries left.`,
      successMessage: null,
      redirectPath: null,
    };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    error: null,
    successMessage: "Logged in successfully. You are being redirected...",
    redirectPath: null,
  };
};

export const disableTwoFactorAuthentication = async () => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    await twoFactorAuthenticationSecretRepository.removeTwoFactorAuthenticationSecret(
      user.id
    );

    await userRepository.updateUser(user.id, {
      prefersTwoFactorAuthentication: 0,
      activatedTwoFactorAuthentication: 0,
    });

    return {
      error: null,
      successMessage: "Two-factor authentication disabled successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Something went wrong while processing your request. Please try again later.",
      successMessage: null,
    };
  }
};

export const validateReCAPTCHAToken = async (token: string) => {
  try {
    const validationUrl = "https://www.google.com/recaptcha/api/siteverify";
    const responseBody = `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;

    const response = await fetch(validationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: responseBody,
    });

    const data = (await response.json()) as IRecaptchaResponse;

    return data.success;
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const getTwoFactorAuthURI = async () => {
  const { user } = await getUser();

  if (!user) {
    return null;
  }

  const [twoFactorAuthenticationSecret] = await db
    .select({
      secret: twoFactorAuthenticationSecrets.secret,
    })
    .from(twoFactorAuthenticationSecrets)
    .where(eq(twoFactorAuthenticationSecrets.userId, user.id));

  if (!twoFactorAuthenticationSecret) {
    return null;
  }

  return createTOTPKeyURI(
    "CashStash",
    user.email,
    decodeHex(twoFactorAuthenticationSecret.secret)
  );
};
