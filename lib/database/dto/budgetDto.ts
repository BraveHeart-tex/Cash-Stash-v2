import { BudgetSchemaType } from "@/schemas/budget-schema";
import { createId } from "@paralleldrive/cuid2";
import { BudgetCategory } from "@/entities/budget";

export interface BudgetDto {
  id: string;
  userId: string;
  name: string;
  category: BudgetCategory;
  spentAmount: number;
  budgetAmount: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export const createBudgetDto = (
  data: BudgetSchemaType,
  userId: string
): BudgetDto => {
  return {
    ...data,
    id: createId(),
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
