import { TransactionCategory } from "@prisma/client";
import { z } from "zod";

const transactionSchema = z.object({
  amount: z.coerce.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  description: z.coerce.string(),
  category: z.nativeEnum(TransactionCategory).superRefine((val, ctx) => {
    if (!val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category is required",
        path: ["category"],
      });
    }
  }),
  accountId: z.string().min(1, "Please select an account"),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
export default transactionSchema;
