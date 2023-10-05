import { User } from "@prisma/client";
import {
  JWTVerifyResult,
  JWTVerifyResultWithUser,
  SignJWT,
  jwtVerify,
} from "jose";

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

    return payload.id !== undefined;
  } catch (error) {
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
