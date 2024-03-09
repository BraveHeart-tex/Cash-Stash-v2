import { Lucia } from "lucia";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import mysql from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";
import { sessions, users } from "@/lib/database/schema";
import * as schema from "@/lib/database/schema";

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: 3306,
  database: process.env.DATABASE_NAME,
  namedPlaceholders: true,
  multipleStatements: true,
});

export const db = drizzle(connection, {
  schema: schema,
  mode: "default",
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
    };
  },
});

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
