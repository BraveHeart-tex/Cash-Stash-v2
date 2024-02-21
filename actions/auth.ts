"use server";
import prisma from "@/lib/db";
import { signToken, getCurrentUser } from "@/lib/session";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import { RegisterSchemaType } from "@/schemas/RegisterSchema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

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

export const register = async ({
  name,
  email,
  password,
}: RegisterSchemaType) => {
  const result = RegisterSchema.safeParse({ name, email, password });

  if (!result.success) {
    return { error: "Unprocessable entitiy." };
  }

  const {
    name: nameResult,
    email: emailResult,
    password: passwordResult,
  } = result.data;

  const userExists = await prisma.user.findUnique({
    where: {
      email: emailResult,
    },
  });

  if (userExists) {
    return {
      error: `User already exists with the given email: ${emailResult}`,
    };
  }

  const hashedPassword = await bcrypt.hash(passwordResult, 12);

  const user = await prisma.user.create({
    data: {
      name: nameResult,
      email: emailResult,
      hashedPassword,
    },
  });

  if (!user) {
    return { error: "There was an error while creating a user." };
  }

  const jwt = await signToken(user);

  cookies().set("token", jwt);

  return {
    user,
  };
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
