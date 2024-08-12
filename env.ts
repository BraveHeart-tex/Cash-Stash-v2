import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    EMAIL_PORT: z.string().min(1),
    RECAPTCHA_SECRET_KEY: z.string().min(1),
    CRON_API_KEY: z.string().min(1),
    EMAIL_HOST: z.string().min(1),
    EMAIL_USER: z.string().min(1),
    REDIS_CONNECTION_STRING: z.string().min(1),
    JWT_SECRET_KEY: z.string().min(1),
    EMAIL_PASSWORD: z.string().min(1),
    OPEN_EXCHANGE_RATE_APP_ID: z.string().min(1),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_PORT: process.env.EMAIL_PORT,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    CRON_API_KEY: process.env.CRON_API_KEY,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_USER: process.env.EMAIL_USER,
    REDIS_CONNECTION_STRING: process.env.REDIS_CONNECTION_STRING,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    OPEN_EXCHANGE_RATE_APP_ID: process.env.OPEN_EXCHANGE_RATE_APP_ID,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
