export enum TransactionCategory {
  FOOD = "FOOD",
  TRANSPORTATION = "TRANSPORTATION",
  ENTERTAINMENT = "ENTERTAINMENT",
  UTILITIES = "UTILITIES",
  SHOPPING = "SHOPPING",
  HOUSING = "HOUSING",
  OTHER = "OTHER",
}

export interface Transaction {
  id: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  category: TransactionCategory;
  description: string;
  accountId: string;
  userId: string;
}
