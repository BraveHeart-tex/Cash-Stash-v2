import { z } from "zod";

const transactionSchema = z.object({
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description is too long"),
  categoryId: z.coerce
    .number()
    .min(1, "Category is required")
    .positive()
    .default(0),
  accountId: z.coerce
    .number({
      required_error: "Account is required",
      invalid_type_error: "Please select an account",
    })
    .min(1, "Please select an account"),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
export default transactionSchema;
