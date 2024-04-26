import { accounts } from "@/lib/database/schema";
import { z } from "zod";

const accountSchema = z.object({
  balance: z.coerce
    .number()
    .transform((val) => (isNaN(val) ? 0 : val))
    .default(0),
  category: z
    .enum(accounts.category.enumValues, {
      required_error: "Account Category is required",
      invalid_type_error: "Invalid account category",
    })
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Account Category is required",
          path: ["category"],
        });
      }
    }),
  name: z.string().min(1, "Account name is required"),
});

export type AccountSchemaType = z.infer<typeof accountSchema>;
export default accountSchema;
