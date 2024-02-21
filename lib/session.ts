import { User } from "@prisma/client";
import { cache } from "react";
import { cookies } from "next/headers";
import {
  JWTVerifyResult,
  JWTVerifyResultWithUser,
  SignJWT,
  jwtVerify,
} from "jose";
import { lucia } from "./db";

declare module "jose" {
  export interface JWTVerifyResultWithUser extends JWTVerifyResult {
    payload: User;
  }
}

export const getJwtSecretKey = () => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Secret key for JWT is not defined");
  }

  return new TextEncoder().encode(secretKey);
};

export async function verifyJWTToken(token: string) {
  try {
    const { payload } = (await jwtVerify(
      token,
      getJwtSecretKey()
    )) as JWTVerifyResultWithUser;

    return payload.id ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser(token: string) {
  try {
    const { payload } = (await jwtVerify(
      token,
      getJwtSecretKey()
    )) as JWTVerifyResultWithUser;
    return payload;
  } catch (error) {
    return null;
  }
}

export async function signToken(payload: Partial<User>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1w")
    .sign(getJwtSecretKey());
}

export const getUser = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return user;
});
