import { BudgetSchemaType } from "@/schemas/budget-schema";
import { BudgetInsertModel } from "@/lib/database/schema";

export const createBudgetDto = (
  data: BudgetSchemaType,
  userId: string
): BudgetInsertModel => {
  return {
    ...data,
    userId,
    updatedAt: new Date().toISOString(),
  };
};
