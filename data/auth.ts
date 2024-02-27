"use server";
import prisma, { lucia } from "@/lib/data/db";
import { getUser } from "@/lib/auth/session";
import { Argon2id } from "oslo/password";
import loginSchema, { LoginSchemaType } from "@/schemas/login-schema";
import registerSchema, { RegisterSchemaType } from "@/schemas/register-schema";
import { ZodError } from "zod";
import { processZodError } from "@/lib/utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkRateLimit,
  checkIPBasedSendVerificationCodeRateLimit,
  checkSignUpRateLimit,
  checkUserIdBasedSendVerificationCodeRateLimit,
  verifyVerificationCodeRateLimit,
} from "@/lib/redis/redisUtils";
import {
  EMAIL_VERIFICATION_REDIRECTION_PATHS,
  MAX_LOGIN_REQUESTS_PER_MINUTE,
  MAX_SIGN_UP_REQUESTS_PER_MINUTE,
  MAX_VERIFICATION_CODE_ATTEMPTS,
  PAGE_ROUTES,
  SEND_VERIFICATION_CODE_RATE_LIMIT,
} from "@/lib/constants";
import {
  deleteEmailVerificationCode,
  generateEmailVerificationCode,
  sendEmailVerificationCode,
  verifyVerificationCode,
} from "@/lib/auth/authUtils";
import { revalidatePath } from "next/cache";

export const login = async (values: LoginSchemaType) => {
  const header = headers();
  const ipAdress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  const count = await checkRateLimit(ipAdress);

  if (count > MAX_LOGIN_REQUESTS_PER_MINUTE) {
    return {
      error:
        "You have made too many requests. Please wait a minute before trying again.",
      fieldErrors: [],
    };
  }

  try {
    const data = loginSchema.parse(values);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!existingUser) {
      return { error: "Incorrect email or password", fieldErrors: [] };
    }

    const isPasswordValid = await new Argon2id().verify(
      existingUser.hashedPassword,
      data.password
    );

    if (!isPasswordValid) {
      return { error: "Incorrect email or password", fieldErrors: [] };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      user: existingUser,
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

export const register = async (values: RegisterSchemaType) => {
  try {
    const data = registerSchema.parse(values);

    const userExists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExists && userExists.email_verified === false) {
      const header = headers();
      const ipAdress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
        ","
      )[0];
      const count = await checkSignUpRateLimit(userExists.id, ipAdress);

      if (count > MAX_SIGN_UP_REQUESTS_PER_MINUTE) {
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
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashedPassword,
        email_verified: false,
      },
    });

    if (!user) {
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
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
        email_verified: false,
      },
    });

    if (!userWithEmail) {
      return {
        hasValidVarficationCode: false,
        timeLeft: 0,
      };
    }

    const verificationCode = await prisma.emailVerificationCode.findFirst({
      where: {
        userId: userWithEmail.id,
        email,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return {
      hasValidVarficationCode: !!verificationCode,
      timeLeft: verificationCode?.expiresAt
        ? Math.floor((verificationCode.expiresAt.getTime() - Date.now()) / 1000)
        : 0,
    };
  } catch (error) {
    console.error(error);
    return {
      hasValidVarficationCode: false,
      timeLeft: 0,
    };
  }
};

export const handleEmailVerification = async (email: string, code: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const isValid = await verifyVerificationCode(user, code);

  if (!isValid) {
    const header = headers();
    const ipAdress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(
      ","
    )[0];
    const verificationCount = await verifyVerificationCodeRateLimit(ipAdress);

    if (verificationCount === MAX_VERIFICATION_CODE_ATTEMPTS) {
      await deleteEmailVerificationCode(user.id);
      return {
        error: "Too many attempts. Please wait before trying again.",
        successMessage: null,
        redirectPath: EMAIL_VERIFICATION_REDIRECTION_PATHS.TOO_MANY_REQUESTS,
      };
    }

    const triesLeft = MAX_VERIFICATION_CODE_ATTEMPTS - verificationCount;

    return {
      error: "Invalid verification code. You have " + triesLeft + " tries left",
      successMessage: null,
    };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      email_verified: true,
    },
  });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  await deleteEmailVerificationCode(user.id);

  return {
    error: null,
    successMessage: "Email verified successfully. You are being redirected...",
  };
};
export const resendEmailVerificationCode = async (email: string) => {
  const header = headers();
  const ipAdress = (header.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  const count = await checkIPBasedSendVerificationCodeRateLimit(ipAdress);
  if (count > SEND_VERIFICATION_CODE_RATE_LIMIT) {
    return {
      message: "Too many requests. Please wait before trying again.",
      isError: true,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

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

  if (userIdBasedCount > SEND_VERIFICATION_CODE_RATE_LIMIT) {
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
