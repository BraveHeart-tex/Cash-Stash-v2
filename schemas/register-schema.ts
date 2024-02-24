import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name cannot be less than 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters.")
    .max(100, "Password cannot exceed 100 characters.")
    .refine((password) => {
      return (
        password.match(/[a-z]/) &&
        password.match(/[A-Z]/) &&
        password.match(/[0-9]/)
      );
    }, "Password should contain at least one uppercase letter, one lowercase letter, and one number."),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export default registerSchema;
