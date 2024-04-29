import { z } from "zod";

export const getLoginSchema = (messageConfig: LoginSchemaMessageConfig) => {
  const { invalidEmail, passwordTooShort, passwordTooLong } = messageConfig;
  return z.object({
    email: z.string().email(invalidEmail),
    password: z.string().min(8, passwordTooShort).max(100, passwordTooLong),
  });
};

type LoginSchemaMessageConfig = {
  invalidEmail: string;
  passwordTooShort: string;
  passwordTooLong: string;
};

export type LoginSchemaType = z.infer<ReturnType<typeof getLoginSchema>>;
