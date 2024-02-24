"use server";
import prisma, { lucia } from "@/lib/data/db";
import { getUser } from "@/lib/auth/session";
import { Argon2id } from "oslo/password";
import loginSchema, { LoginSchemaType } from "@/schemas/login-schema";
import registerSchema, { RegisterSchemaType } from "@/schemas/register-schema";
import { ZodError } from "zod";
import { processZodError } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (values: LoginSchemaType) => {
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
      },
    });

    if (!user) {
      return {
        error:
          "There was a problem while processing your request. Please try again later.",
        fieldErrors: [],
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
      user,
      error: "",
      fieldErrors: [],
    };
  } catch (error) {
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
  return redirect("/login");
};
