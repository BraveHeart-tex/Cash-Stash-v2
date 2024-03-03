export enum AccountCategory {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  CREDIT_CARD = "CREDIT_CARD",
  INVESTMENT = "INVESTMENT",
  LOAN = "LOAN",
  OTHER = "OTHER",
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  userId: string;
  category: AccountCategory;
  createdAt: Date;
  updatedAt: Date;
}
