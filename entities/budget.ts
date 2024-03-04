export enum BudgetCategory {
  FOOD = "FOOD",
  TRANSPORTATION = "TRANSPORTATION",
  ENTERTAINMENT = "ENTERTAINMENT",
  UTILITIES = "UTILITIES",
  SHOPPING = "SHOPPING",
  HOUSING = "HOUSING",
  OTHER = "OTHER",
}

export interface Budget {
  id: string;
  name: string;
  budgetAmount: number;
  spentAmount: number;
  userId: string;
  progress: number;
  category: BudgetCategory;
  createdAt: Date;
  updatedAt: Date;
}
