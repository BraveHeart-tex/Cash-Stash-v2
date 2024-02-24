import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters.")
    .max(100, "Password cannot exceed 100 characters."),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export default loginSchema;
