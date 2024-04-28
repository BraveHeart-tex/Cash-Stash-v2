import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters.")
    .max(100, "Password cannot exceed 100 characters."),
});

// TODO:
const getLoginSchema = (obj: {
  invalidEmail: string;
  passwordTooShort: string;
  passwordTooLong: string;
}) => {
  const { invalidEmail, passwordTooShort, passwordTooLong } = obj;
  return z.object({
    email: z.string().email(invalidEmail),
    password: z.string().min(8, passwordTooShort).max(100, passwordTooLong),
  });
};

export type LoginSchemaType = z.infer<typeof loginSchema>;
export default loginSchema;
