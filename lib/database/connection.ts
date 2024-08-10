import { sessions, users } from "@/lib/database/schema";
import * as schema from "@/lib/database/schema";
import QueryLogger from "@/lib/utils/queryLogger";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import { Lucia } from "lucia";
import mysql from "mysql2";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: 3306,
  database: process.env.DATABASE_NAME,
  namedPlaceholders: true,
  multipleStatements: true,
});

const asyncPool = pool.promise();

export const db = drizzle(asyncPool, {
  schema,
  mode: "default",
  logger: new QueryLogger(),
});

export const adapter = new DrizzleMySQLAdapter(db, sessions, users);

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
      activatedTwoFactorAuthentication:
        databaseUserAttributes.activatedTwoFactorAuthentication,
      preferredCurrency: databaseUserAttributes.preferredCurrency,
    };
  },
});

declare module "lucia" {
  // eslint-disable-next-line no-unused-vars
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
