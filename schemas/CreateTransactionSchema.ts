import { z } from "zod";

const CreateTransactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description cannot be empty"),
  category: z.string().min(1, "Category cannot be empty"),
  accountId: z.number().positive("Please select an account"),
  isIncome: z.boolean(),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
export default CreateTransactionSchema;
