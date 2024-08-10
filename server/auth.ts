"use server";
import {
  authenticatedAction,
  authenticatedActionWithNoParams,
  sendEmailVerificationCode,
  sendResetPasswordLink,
} from "@/lib/auth/authUtils";
import { getUser } from "@/lib/auth/session";
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
import { db, lucia } from "@/lib/database/connection";
import emailVerificationCodeRepository from "@/lib/database/repository/emailVerificationCodeRepository";
import passwordResetTokenRepository from "@/lib/database/repository/passwordResetTokenRepository";
import twoFactorAuthenticationSecretRepository from "@/lib/database/repository/twoFactorAuthenticationSecretRepository";
import userRepository from "@/lib/database/repository/userRepository";
import { twoFactorAuthenticationSecrets } from "@/lib/database/schema";
import {
  checkIPBasedSendVerificationCodeRateLimit,
  checkIpBasedTwoFactorAuthRateLimit,
  checkRateLimit,
  checkSignUpRateLimit,
  checkUserIdBasedSendVerificationCodeRateLimit,
  checkUserIdBasedTwoFactorAuthRateLimit,
  verifyResetPasswordLinkRequestRateLimit,
  verifyVerificationCodeRateLimit,
} from "@/lib/redis/redisUtils";
import logger from "@/lib/utils/logger";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import { redirect } from "@/navigation";
import { type LoginSchemaType, getLoginSchema } from "@/schemas/login-schema";
import {
  type RegisterSchemaType,
  getRegisterSchema,
} from "@/schemas/register-schema";
import { createPasswordResetToken } from "@/server/passwordResetToken";
import {
  generateEmailVerificationCode,
  verifyVerificationCode,
} from "@/server/verificationCode";
import type { ActivateTwoFactorAuthenticationReturnType } from "@/typings/auth";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { isWithinExpirationDate } from "oslo";
import { decodeHex, encodeHex } from "oslo/encoding";
import { TOTPController, createTOTPKeyURI } from "oslo/otp";
import { Argon2id } from "oslo/password";
import { ZodError } from "zod";

export const login = async (values: LoginSchemaType) => {
  const header = headers();
  const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
    ",",
  )[0];
  const count = await checkRateLimit(ipAddress);

  const actionT = await getTranslations("Actions.Auth.login");

  if (count >= MAX_LOGIN_REQUESTS_PER_MINUTE) {
    return {
      error: actionT("rateLimitExceeded"),
      fieldErrors: [],
      twoFactorAuthenticationRequired: false,
    };
  }

  try {
    const zodT = await getTranslations("Zod.Login");
    const loginSchema = getLoginSchema({
      invalidEmail: zodT("invalidEmail"),
      passwordTooShort: zodT("passwordTooShort"),
      passwordTooLong: zodT("passwordTooLong"),
    });

    const data = loginSchema.parse(values);

    const existingUser = await userRepository.getByEmail(data.email);

    if (!existingUser) {
      return {
        error: actionT("incorrectCredentials"),
        fieldErrors: [],
        twoFactorAuthenticationRequired: false,
      };
    }

    const isPasswordValid = await new Argon2id().verify(
      existingUser.hashedPassword,
      data.password,
    );

    if (!isPasswordValid) {
      return {
        error: actionT("incorrectCredentials"),
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
      sessionCookie.attributes,
    );

    return {
      error: "",
      fieldErrors: [],
      twoFactorAuthenticationRequired: false,
    };
  } catch (error) {
    logger.error(error);

    if (error instanceof ZodError) {
      return {
        ...processZodError(error),
        twoFactorAuthenticationRequired: false,
      };
    }

    return {
      error: actionT("internalErrorMessage"),
      fieldErrors: [],
      redirectPath: null,
      twoFactorAuthenticationRequired: false,
    };
  }
};

export const register = async (values: RegisterSchemaType) => {
  const [t, actionT] = await Promise.all([
    getTranslations("Zod.Register"),
    getTranslations("Actions.Auth.register"),
  ]);
  try {
    const registerSchema = getRegisterSchema({
      invalidEmail: t("invalidEmail"),
      nameTooShort: t("nameTooShort"),
      nameTooLong: t("nameTooLong"),
      passwordTooShort: t("passwordTooShort"),
      passwordTooLong: t("passwordTooLong"),
      invalidPassword: t("invalidPassword"),
    });

    const data = registerSchema.parse(values);

    const userExists = await userRepository.getByEmail(data.email);

    if (userExists && !userExists.emailVerified) {
      const header = headers();
      const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
        ",",
      )[0];
      const count = await checkSignUpRateLimit(userExists.id, ipAddress);

      if (count >= MAX_SIGN_UP_REQUESTS_PER_MINUTE) {
        return {
          error: actionT("rateLimitExceeded"),
          fieldErrors: [],
        };
      }

      return {
        error: actionT("unverifiedEmailAlreadyExists"),
        fieldErrors: [
          {
            field: "email",
            message: actionT("unverifiedEmailAlreadyExists"),
          },
        ],
      };
    }

    if (userExists) {
      return {
        error: actionT("userAlreadyExists", { email: data.email }),
        fieldErrors: [
          {
            field: "email",
            message: actionT("userAlreadyExists", { email: data.email }),
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
      true,
    );

    const { affectedRows, user } = createUserResponse;

    if (!user || affectedRows === 0) {
      return {
        error: actionT("internalErrorMessage"),
        fieldErrors: [],
      };
    }

    const verificationCode = await generateEmailVerificationCode(
      user.id,
      user.email,
    );

    await sendEmailVerificationCode(user.email, verificationCode);

    return {
      user,
      error: "",
      fieldErrors: [],
    };
  } catch (error) {
    logger.error(error);

    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error: actionT("internalErrorMessage"),
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
    sessionCookie.attributes,
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
        userWithEmail.id,
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
            (new Date(verificationCode.expiresAt).getTime() - Date.now()) /
              1000,
          )
        : 0,
    };
  } catch (error) {
    logger.error(error);
    return {
      hasValidVerificationCode: false,
      timeLeft: 0,
    };
  }
};

export const handleEmailVerification = async (email: string, code: string) => {
  const actionT = await getTranslations("Actions.Auth.handleEmailVerification");

  try {
    const user = await userRepository.getUnverifiedUserByEmail(email);

    if (!user) {
      return redirect(PAGE_ROUTES.LOGIN_ROUTE);
    }

    const isValid = await verifyVerificationCode(user, code);

    if (!isValid) {
      const header = headers();
      const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
        ",",
      )[0];
      const verificationCount =
        await verifyVerificationCodeRateLimit(ipAddress);

      if (verificationCount >= MAX_VERIFICATION_CODE_ATTEMPTS) {
        await emailVerificationCodeRepository.deleteByUserId(user.id);
        return {
          error: actionT("rateLimitExceeded"),
          successMessage: null,
          redirectPath: EMAIL_VERIFICATION_REDIRECTION_PATHS.TOO_MANY_REQUESTS,
        };
      }

      const triesLeft = MAX_VERIFICATION_CODE_ATTEMPTS - verificationCount;

      return {
        error: actionT("invalidCode", {
          attemptsLeft: triesLeft,
        }),
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
      sessionCookie.attributes,
    );

    await emailVerificationCodeRepository.deleteByUserId(user.id);

    return {
      error: null,
      successMessage: actionT("successMessage"),
    };
  } catch (error) {
    logger.error("Error while verifying email", error);
    return {
      error: actionT("internalErrorMessage"),
      successMessage: null,
    };
  }
};

export const resendEmailVerificationCode = async (email: string) => {
  const actionT = await getTranslations(
    "Actions.Auth.resendEmailVerificationCode",
  );
  const header = headers();
  const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
    ",",
  )[0];
  const count = await checkIPBasedSendVerificationCodeRateLimit(ipAddress);
  if (count >= SEND_VERIFICATION_CODE_RATE_LIMIT) {
    return {
      message: actionT("rateLimitExceeded"),
      isError: true,
    };
  }

  const user = await userRepository.getUnverifiedUserByEmail(email);

  if (!user) {
    return {
      message: actionT("successMessage"),
      isError: false,
    };
  }

  const userIdBasedCount = await checkUserIdBasedSendVerificationCodeRateLimit(
    user.id,
  );

  if (userIdBasedCount >= SEND_VERIFICATION_CODE_RATE_LIMIT) {
    return {
      message: actionT("rateLimitExceeded"),
      isError: true,
    };
  }

  const verificationCode = await generateEmailVerificationCode(
    user.id,
    user.email,
  );

  await sendEmailVerificationCode(user.email, verificationCode);

  revalidatePath(`${PAGE_ROUTES.EMAIL_VERIFICATION_ROUTE}/${email}`, "layout");

  return {
    isError: false,
    message: actionT("successMessage"),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  const actionT = await getTranslations("Actions.Auth.sendPasswordResetEmail");
  const header = headers();
  const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
    ",",
  )[0];
  const count = await verifyResetPasswordLinkRequestRateLimit(ipAddress);
  if (count >= MAX_RESET_PASSWORD_LINK_REQUESTS_PER_MINUTE) {
    return {
      message: actionT("rateLimitExceeded"),
      isError: true,
    };
  }

  const user = await userRepository.getVerifiedUserByEmail(email);

  if (!user) {
    return {
      message: actionT("successMessage"),
      isError: false,
    };
  }

  const verificationToken = await createPasswordResetToken(user.id);
  const verificationLink = getResetPasswordUrl(email, verificationToken);

  await sendResetPasswordLink(email, verificationLink);

  return {
    isError: false,
    message: actionT("successMessage"),
  };
};

export const checkResetPasswordEmailAndToken = async ({
  email,
  token,
}: {
  email: string;
  token: string;
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

  return {
    error: null,
    successMessage: null,
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
  const actionT = await getTranslations("Actions.Auth.resetPassword");
  const user = await userRepository.getVerifiedUserByEmail(email);

  if (!user) {
    return {
      error: actionT("invalidRequest"),
      successMessage: null,
    };
  }

  const resetToken = await passwordResetTokenRepository.getByToken(token);

  if (!resetToken || !isWithinExpirationDate(new Date(resetToken.expiresAt))) {
    return {
      error: actionT("invalidRequest"),
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
    sessionCookie.attributes,
  );

  return {
    error: null,
    successMessage: actionT("successMessage"),
  };
};

export const enableTwoFactorAuthentication = authenticatedActionWithNoParams(
  async (user) => {
    await userRepository.updateUser(user.id, {
      prefersTwoFactorAuthentication: 1,
    });

    const twoFactorSecret = crypto.getRandomValues(new Uint8Array(20));

    await twoFactorAuthenticationSecretRepository.create({
      secret: encodeHex(twoFactorSecret),
      userId: user.id,
    });

    return createTOTPKeyURI("CashStash", user.email, twoFactorSecret);
  },
);

export const activateTwoFactorAuthentication = authenticatedAction<
  ActivateTwoFactorAuthenticationReturnType,
  string
>(async (otp, { user }) => {
  const t = await getTranslations(
    "Actions.Auth.activateTwoFactorAuthentication",
  );

  const result = await twoFactorAuthenticationSecretRepository.getByUserId(
    user.id,
  );

  if (!result) {
    return {
      error: t("invalidRequest"),
      successMessage: null,
    };
  }

  const isValid = await new TOTPController().verify(
    otp,
    decodeHex(result.secret),
  );

  if (!isValid) {
    return {
      error: t("invalidCode"),
      successMessage: null,
    };
  }

  await userRepository.updateUser(user.id, {
    activatedTwoFactorAuthentication: 1,
  });

  return {
    error: null,
    successMessage: t("successMessage"),
  };
});

export const validateOTP = async (otp: string, email: string) => {
  const header = headers();
  const ipAddress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
    ",",
  )[0];
  const t = await getTranslations("Actions.Auth.validateOTP");
  const count = await checkIpBasedTwoFactorAuthRateLimit(ipAddress);

  if (count >= MAX_TWO_FACTOR_AUTH_ATTEMPTS) {
    return {
      error: t("rateLimitExceeded"),
      successMessage: null,
      redirectPath: PAGE_ROUTES.LOGIN_ROUTE,
    };
  }

  const user = await userRepository.getByEmail(email);

  if (!user || !user?.prefersTwoFactorAuthentication) {
    return {
      error: t("invalidRequest"),
      successMessage: null,
      redirectPath: null,
    };
  }

  const userIdBasedCount = await checkUserIdBasedTwoFactorAuthRateLimit(
    user.id,
  );

  if (userIdBasedCount >= MAX_TWO_FACTOR_AUTH_ATTEMPTS) {
    return {
      error: t("rateLimitExceeded"),
      successMessage: null,
      redirectPath: PAGE_ROUTES.LOGIN_ROUTE,
    };
  }

  const result = await twoFactorAuthenticationSecretRepository.getByUserId(
    user.id,
  );

  if (!result) {
    return {
      error: t("invalidRequest"),
      successMessage: null,
      redirectPath: PAGE_ROUTES.LOGIN_ROUTE,
    };
  }

  const isValid = await new TOTPController().verify(
    otp,
    decodeHex(result.secret),
  );

  if (!isValid) {
    const attemptsLeft = MAX_TWO_FACTOR_AUTH_ATTEMPTS - userIdBasedCount;
    return {
      error: t("invalidCode", { attemptsLeft }),
      successMessage: null,
      redirectPath: null,
    };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return {
    error: null,
    successMessage: t("successMessage"),
    redirectPath: null,
  };
};

export const disableTwoFactorAuthentication = async () => {
  const { user } = await getUser();
  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const actionT = await getTranslations(
    "Actions.Auth.disableTwoFactorAuthentication",
  );
  try {
    await twoFactorAuthenticationSecretRepository.removeTwoFactorAuthenticationSecret(
      user.id,
    );

    await userRepository.updateUser(user.id, {
      prefersTwoFactorAuthentication: 0,
      activatedTwoFactorAuthentication: 0,
    });

    return {
      error: null,
      successMessage: actionT("successMessage"),
    };
  } catch (error) {
    logger.error(error);
    return {
      error: actionT("internalErrorMessage"),
      successMessage: null,
    };
  }
};

type RecaptchaResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes": string[];
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

    const data = (await response.json()) as RecaptchaResponse;

    return data.success;
  } catch (error) {
    logger.error(error);
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
    decodeHex(twoFactorAuthenticationSecret.secret),
  );
};
