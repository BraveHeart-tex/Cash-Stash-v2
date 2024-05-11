import { z } from "zod";

const transactionSchema = z.object({
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description is too long"),
  categoryId: z.coerce
    .number({
      required_error: "Category is required",
      invalid_type_error: "Please select a category",
    })
    .min(1, "Category is required")
    .positive({
      message: "Please select a category",
    })
    .default(0),
  accountId: z.coerce
    .number({
      required_error: "Account is required",
      invalid_type_error: "Please select an account",
    })
    .positive({ message: "Please select an account" })
    .default(0),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
export default transactionSchema;
