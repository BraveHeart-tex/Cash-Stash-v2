import { BudgetCategory } from "@prisma/client";
import { z } from "zod";

const budgetSchema = z
  .object({
    name: z.string().min(1, "Name cannot be blank"),
    budgetAmount: z.coerce
      .number({
        invalid_type_error: "Budget amount must be a number",
        required_error: "Budget amount is required",
      })
      .positive("Budget amount must be positive"),
    category: z
      .nativeEnum(BudgetCategory, {
        required_error: "Budget Category is required",
        invalid_type_error: "Invalid budget category",
      })
      .superRefine((val, ctx) => {
        if (!val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Budget Category is required",
            path: ["category"],
          });
        }
      }),
    spentAmount: z.coerce
      .number()
      .nonnegative("Spent amount can't be negative")
      .default(0),
    progress: z.number().default(0),
  })
  .superRefine((data) => {
    data.progress = Math.round((data.spentAmount / data.budgetAmount) * 100);
    return data;
  });

export type BudgetSchemaType = z.infer<typeof budgetSchema>;

export default budgetSchema;
