import type { Config } from "drizzle-kit";
import { env } from "./env";

export default {
  schema: "./lib/database/schema.ts",
  dialect: "mysql",
  out: "./migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
