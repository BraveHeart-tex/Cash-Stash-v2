import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  schema: "./lib/database/schema.ts",
  driver: "mysql2",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.DATABASE_HOST as string,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: 3306,
    database: process.env.DATABASE_NAME as string,
  },
}) satisfies Config;
