import mysql from "mysql2";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import { Lucia } from "lucia";

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

export const adapter = new Mysql2Adapter(asyncPool, {
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

export default asyncPool;
