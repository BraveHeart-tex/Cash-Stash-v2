/* eslint-disable no-unused-vars */
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined;
}

const prisma = globalThis.client || new PrismaClient();
const adapter = new PrismaAdapter(prisma.session, prisma.user);
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

if (process.env.NODE_ENV === "development") {
  globalThis.client = prisma;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}

export default prisma;
