import { z } from "zod";

type internationalizationConfig = {
  blankName: string;
  budgetAmountRequired: string;
  budgetAmountPositive: string;
  budgetAmountInvalid: string;
  budgetCategoryRequired: string;
  spentAmountNegative: string;
};

export const getBudgetSchema = (
  internationalizationConfig: internationalizationConfig,
) => {
  const {
    blankName,
    budgetAmountPositive,
    budgetCategoryRequired,
    budgetAmountInvalid,
    budgetAmountRequired,
    spentAmountNegative,
  } = internationalizationConfig;

  return z
    .object({
      name: z.string().min(1, blankName),
      budgetAmount: z.coerce
        .number({
          invalid_type_error: budgetAmountInvalid,
          required_error: budgetAmountRequired,
        })
        .positive(budgetAmountPositive)
        .transform((val) => (Number.isNaN(val) ? 1 : val)),
      categoryId: z.coerce
        .number()
        .min(1, budgetCategoryRequired)
        .positive()
        .default(0),
      spentAmount: z.coerce
        .number()
        .nonnegative(spentAmountNegative)
        .transform((val) => (Number.isNaN(val) ? 0 : val))
        .default(0),
      progress: z.number().default(0),
    })
    .superRefine((data) => {
      if (Number.isNaN(data.budgetAmount)) data.budgetAmount = 1;
      if (Number.isNaN(data.spentAmount)) data.spentAmount = 0;

      data.progress = Math.floor((data.spentAmount / data.budgetAmount) * 100);

      return data;
    });
};

export type BudgetSchemaType = z.infer<ReturnType<typeof getBudgetSchema>>;
