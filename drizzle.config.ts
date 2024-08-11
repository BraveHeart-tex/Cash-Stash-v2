import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

export default {
  schema: "./lib/database/schema.ts",
  dialect: "mysql",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
