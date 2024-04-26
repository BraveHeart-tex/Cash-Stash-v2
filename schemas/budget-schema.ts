import { z } from "zod";

const budgetSchema = z
  .object({
    name: z.string().min(1, "Name cannot be blank"),
    budgetAmount: z.coerce
      .number({
        invalid_type_error: "Budget amount must be a number",
        required_error: "Budget amount is required",
      })
      .positive("Budget amount must be positive")
      .transform((val) => (isNaN(val) ? 0 : val)),
    categoryId: z.coerce
      .number()
      .min(1, "Budget category is required")
      .positive()
      .default(0),
    spentAmount: z.coerce
      .number()
      .nonnegative("Spent amount can't be negative")
      .transform((val) => (isNaN(val) ? 0 : val))
      .default(0),
    progress: z.number().default(0),
  })
  .superRefine((data) => {
    data.progress = Math.floor((data.spentAmount / data.budgetAmount) * 100);
    return data;
  });

export type BudgetSchemaType = z.infer<typeof budgetSchema>;

export default budgetSchema;
