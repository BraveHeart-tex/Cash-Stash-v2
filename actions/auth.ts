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
import { checkRateLimit, checkSignUpRateLimit } from "@/lib/redis/redisUtils";
import {
  MAX_LOGIN_REQUESTS_PER_MINUTE,
  MAX_SIGN_UP_REQUESTS_PER_MINUTE,
  PAGE_ROUTES,
} from "@/lib/constants";
import {
  deleteEmailVerificationCode,
  generateEmailVerificationCode,
  sendEmailVerificationCode,
  verifyVerificationCode,
} from "@/lib/auth/authUtils";

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
    // TODO: Extract to constants and implement custom component for showing errors
    redirect(PAGE_ROUTES.LOGIN_ROUTE + "?error=verification-failed");
  }

  const isValid = await verifyVerificationCode(user, code);

  if (!isValid) {
    // TODO: incr trial count for rate limiting
    const triesLeft = 2;
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
