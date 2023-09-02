import { z } from "zod";

const CreateBudgetSchema = z.object({
  budgetAmount: z.coerce.number().positive("Budget amount must be positive"),
  category: z.string().nonempty("Category must not be empty"),
  spentAmount: z.coerce.number().positive("Spent amount must be positive"),
});

export type CreateBudgetSchemaType = z.infer<typeof CreateBudgetSchema>;

export default CreateBudgetSchema;
