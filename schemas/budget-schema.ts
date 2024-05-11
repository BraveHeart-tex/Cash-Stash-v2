import { z } from "zod";

type InternatilizationConfig = {
  blankName: string;
  budgetAmountRequired: string;
  budgetAmountPositive: string;
  budgetAmountInvalid: string;
  budgetCategoryRequired: string;
  spentAmountNegative: string;
};

export const getBudgetSchema = (
  internatilizationConfig: InternatilizationConfig
) => {
  const {
    blankName,
    budgetAmountPositive,
    budgetCategoryRequired,
    budgetAmountInvalid,
    budgetAmountRequired,
    spentAmountNegative,
  } = internatilizationConfig;

  return z
    .object({
      name: z.string().min(1, blankName),
      budgetAmount: z.coerce
        .number({
          invalid_type_error: budgetAmountInvalid,
          required_error: budgetAmountRequired,
        })
        .positive(budgetAmountPositive)
        .transform((val) => (isNaN(val) ? 1 : val)),
      categoryId: z.coerce
        .number()
        .min(1, budgetCategoryRequired)
        .positive()
        .default(0),
      spentAmount: z.coerce
        .number()
        .nonnegative(spentAmountNegative)
        .transform((val) => (isNaN(val) ? 0 : val))
        .default(0),
      progress: z.number().default(0),
    })
    .superRefine((data) => {
      if (isNaN(data.budgetAmount)) data.budgetAmount = 1;
      if (isNaN(data.spentAmount)) data.spentAmount = 0;

      data.progress = Math.floor((data.spentAmount / data.budgetAmount) * 100);

      return data;
    });
};

export type BudgetSchemaType = z.infer<ReturnType<typeof getBudgetSchema>>;
