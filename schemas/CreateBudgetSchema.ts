import { z } from "zod";

const CreateBudgetSchema = z.object({
  name: z.string().nonempty("Name cannot be blank"),
  budgetAmount: z.coerce.number().positive("Budget amount must be positive"),
  category: z.string().nonempty("Category cannot be blank"),
  spentAmount: z.coerce.number().nonnegative("Spent amount can't be negative").default(0),
});

export type CreateBudgetSchemaType = z.infer<typeof CreateBudgetSchema>;

export default CreateBudgetSchema;
