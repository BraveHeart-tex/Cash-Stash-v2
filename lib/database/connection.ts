import { sessions, users } from "@/lib/database/schema";
import * as schema from "@/lib/database/schema";
import QueryLogger from "@/lib/utils/queryLogger";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import { Lucia } from "lucia";
import { type Pool, createPool } from "mysql2/promise";
import { env } from "@/env";

dotenv.config();

const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn = globalForDb.conn ?? createPool({ uri: env.DATABASE_URL });

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema,
  mode: "default",
  logger: new QueryLogger(),
});

export const adapter = new DrizzleMySQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: env.NODE_ENV === "production",
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
      activatedTwoFactorAuthentication:
        databaseUserAttributes.activatedTwoFactorAuthentication,
      preferredCurrency: databaseUserAttributes.preferredCurrency,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  prefersTwoFactorAuthentication: boolean;
  activatedTwoFactorAuthentication: boolean;
  preferredCurrency: string;
};
