"use server";
import prisma, { lucia } from "@/lib/db";
import { signToken, getCurrentUser } from "@/lib/session";
import { LoginSchema } from "@/schemas";
import { Argon2id } from "oslo/password";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import registerSchema, { RegisterSchemaType } from "@/schemas/register-schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { processZodError } from "@/lib/utils";

export const login = async ({ email, password }: LoginSchemaType) => {
  const result = LoginSchema.safeParse({ email, password });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const { email: emailResult, password: passwordResult } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email: emailResult,
    },
  });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const isPasswordValid = await bcrypt.compare(
    passwordResult,
    user.hashedPassword!
  );

  if (!isPasswordValid) {
    return { error: "Invalid email or password." };
  }

  const jwt = await signToken(user);

  cookies().set("token", jwt);

  return { user };
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
        "Something went wrong while procession your request. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const logout = async () => {
  cookies().delete("token");
  redirect("/login");
};

export const getUserSession = async () => {
  const token = cookies().get("token")?.value;

  if (!token) {
    return { error: "No token found." };
  }

  const user = await getCurrentUser(cookies().get("token")?.value!);

  if (!user) {
    return { error: "No user found." };
  }

  return {
    user,
  };
};
