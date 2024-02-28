import { z } from "zod";

const resetPasswordSchema = z
  .object({
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
    repeatPassword: z.string(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["repeatPassword"],
      });
    }
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export default resetPasswordSchema;
