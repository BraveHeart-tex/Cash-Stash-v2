import { z } from "zod";

export const getRegisterSchema = (internationalizationConfig: {
  invalidEmail: string;
  nameTooShort: string;
  nameTooLong: string;
  passwordTooShort: string;
  passwordTooLong: string;
  invalidPassword: string;
}) => {
  const {
    invalidEmail,
    invalidPassword,
    nameTooLong,
    nameTooShort,
    passwordTooLong,
    passwordTooShort,
  } = internationalizationConfig;
  return z.object({
    name: z.string().min(2, nameTooShort).max(100, nameTooLong),
    email: z.string().email(invalidEmail),
    password: z
      .string()
      .min(8, passwordTooShort)
      .max(100, passwordTooLong)
      .refine((password) => {
        return (
          password.match(/[a-z]/) &&
          password.match(/[A-Z]/) &&
          password.match(/[0-9]/)
        );
      }, invalidPassword),
  });
};

export type RegisterSchemaType = z.infer<ReturnType<typeof getRegisterSchema>>;
