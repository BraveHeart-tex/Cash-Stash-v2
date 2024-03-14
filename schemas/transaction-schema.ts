import { z } from "zod";

enum TransactionCategory {
  "FOOD" = "FOOD",
  "TRANSPORTATION" = "TRANSPORTATION",
  "ENTERTAINMENT" = "ENTERTAINMENT",
  "UTILITIES" = "UTILITIES",
  "SHOPPING" = "SHOPPING",
  "HOUSING" = "HOUSING",
  "OTHER" = "OTHER",
}

const transactionSchema = z.object({
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description is too long"),
  category: z.nativeEnum(TransactionCategory).superRefine((val, ctx) => {
    if (!val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category is required",
        path: ["category"],
      });
    }
  }),
  accountId: z.coerce.number().min(1, "Please select an account"),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
export default transactionSchema;
