/* eslint-disable no-unused-vars */
import { Lucia } from "lucia";
import { PrismaClient } from "@prisma/client";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import connection from "@/lib/data/mysql";

declare global {
  var client: PrismaClient | undefined;
}

const prisma = globalThis.client || new PrismaClient();
const adapter = new Mysql2Adapter(connection, {
  user: "User",
  session: "Session",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      name: databaseUserAttributes.name,
      email: databaseUserAttributes.email,
      emailVerified: databaseUserAttributes.email_verified,
      prefersTwoFactorAuthentication:
        databaseUserAttributes.prefersTwoFactorAuthentication,
    };
  },
});

if (process.env.NODE_ENV === "development") {
  globalThis.client = prisma;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  prefersTwoFactorAuthentication: boolean;
}

export default prisma;
