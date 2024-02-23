import {
  Budget,
  Account,
  AccountCategory,
  Goal,
  BudgetCategory,
  Transaction,
  Reminder,
} from "@prisma/client";

interface IPaginatedResponse {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

interface IPaginatedActionParams {
  pageNumber: number;
  query?: string;
}

export interface TransactionWithAccount extends Transaction {
  account: Partial<Account>;
}

export interface IValidatedResponse<T> {
  data?: T;
  error?: string;
  fieldErrors: {
    field: string;
    message: string | undefined;
  }[];
}

export interface IGetPaginatedAccountsParams extends IPaginatedActionParams {
  sortBy?: string;
  sortDirection?: string;
  category?: AccountCategory;
}

export interface IGetPaginatedAccountsResponse extends IPaginatedResponse {
  accounts: Account[];
}

export interface IGetPaginatedBudgetsParams extends IPaginatedActionParams {
  category?: BudgetCategory;
  sortBy?: string;
  sortDirection?: string;
}

export interface IGetPaginatedBudgetsResponse extends IPaginatedResponse {
  budgets: Budget[];
}

export interface IGetPaginatedGoalsParams extends IPaginatedActionParams {
  sortBy?: string;
  sortDirection?: string;
}

export interface IGetPaginatedGoalsResponse extends IPaginatedResponse {
  goals: Goal[];
}

export type SerializedUserAccount = Omit<Account, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export interface GenericFilterOption<T> {
  label: string;
  data: T;
  icon: React.JSX.Element;
}

export type UpdateBudgetResponse = {
  budget?: Budget;
  error?: string;
  fieldErrors: {
    field: string;
    message: string | undefined;
  }[];
};

export interface InsightsData {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  savingsRate: string;
}

export type SerializedTransaction = Omit<
  Transaction,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  account?: Partial<Account>;
};

export type SerializedReminder = Omit<
  Reminder,
  "createdAt" | "updatedAt" | "reminderDate"
> & {
  createdAt: string;
  updatedAt: string;
  reminderDate: string;
};
