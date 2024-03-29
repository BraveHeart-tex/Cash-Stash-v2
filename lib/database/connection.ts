import { Lucia } from "lucia";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import mysql from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";
import { sessions, users } from "@/lib/database/schema";
import * as schema from "@/lib/database/schema";
import { Logger } from "drizzle-orm/logger";
import * as dotenv from "dotenv";

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

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

export const db = drizzle(asyncPool, {
  schema: schema,
  mode: "default",
  // logger: new MyLogger(),
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
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  prefersTwoFactorAuthentication: boolean;
  activatedTwoFactorAuthentication: boolean;
  preferredCurrency: string;
}
