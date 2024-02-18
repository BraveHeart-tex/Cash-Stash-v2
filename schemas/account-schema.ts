import { AccountCategory } from "@prisma/client";
import { z } from "zod";

const accountSchema = z.object({
  balance: z.coerce.number().default(0),
  category: z
    .nativeEnum(AccountCategory, {
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
