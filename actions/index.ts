"use server";

import db from "@/app/libs/prismadb";
import { signToken } from "@/lib/session";
import { LoginSchema } from "@/schemas";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import RegisterSchema, { RegisterSchemaType } from "@/schemas/RegisterSchema";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export const loginAction = async ({ email, password }: LoginSchemaType) => {
  const result = LoginSchema.safeParse({ email, password });

  if (!result.success) {
    return { error: "Unprocessable entity." };
  }

  const { email: emailResult, password: passwordResult } = result.data;

  const user = await db.user.findUnique({
    where: {
      email: emailResult,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      hashedPassword: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return { error: `User not found with the given email: ${emailResult}` };
  }

  const hashedPassword = user.hashedPassword;

  const isPasswordValid = await bcrypt.compare(passwordResult, hashedPassword!);

  if (!isPasswordValid) {
    return { error: "Password is not valid." };
  }

  const jwt = await signToken(user);

  cookies().set("token", jwt);

  return {
    user,
  };
};

export const registerAction = async ({
  name,
  email,
  password,
  img: image,
}: RegisterSchemaType) => {
  const result = RegisterSchema.safeParse({ name, email, password, image });

  if (!result.success) {
    return { error: "Unprocessable entitiy." };
  }

  const {
    name: nameResult,
    email: emailResult,
    password: passwordResult,
  } = result.data;

  const userExists = await db.user.findUnique({
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

  const user = await db.user.create({
    data: {
      name: nameResult,
      email: emailResult,
      hashedPassword: hashedPassword,
      image: image,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      hashedPassword: true,
      createdAt: true,
      updatedAt: true,
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

export const logoutAction = async () => {
  cookies().set("token", "");

  redirect("/login");
};
