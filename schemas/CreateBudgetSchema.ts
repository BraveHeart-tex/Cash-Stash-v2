import { z } from "zod";

const CreateBudgetSchema = z.object({
  budgetAmount: z.coerce.number().positive("Budget amount must be positive"),
  category: z.string().nonempty("Category must not be empty"),
  spentAmount: z.coerce
    .number()
    .nonnegative("Spent amount can't be negative")
    .default(0),
});

export type CreateBudgetSchemaType = z.infer<typeof CreateBudgetSchema>;

export default CreateBudgetSchema;
