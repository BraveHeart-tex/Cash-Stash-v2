import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name cannot be less than 2 characters.")
    .max(100, "Name cannot exceed 100 characters.").describe(`
    type: text,
    label: Full Name,
  `),
  email: z.string().email("Please enter a valid email address.").describe(`
    type: text,
    label: Email,
  `),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters.")
    .max(100, "Password cannot exceed 100 characters.").describe(`
    type: password,
    label: Password,
  `),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export default registerSchema;