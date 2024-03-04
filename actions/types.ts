import prisma from "@/lib/database/db";
import {
  Budget,
  Account,
  Goal,
  Transaction,
  Reminder,
  TransactionCategory,
} from "@prisma/client";
import { IconType } from "react-icons/lib";
import { AccountCategory } from "@/entities/account";
import { BudgetCategory } from "@/entities/budget";

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

export type TableMap = {
  [key in TableName]: (typeof prisma)[key];
};

export type WhereCondition<T> = {
  [key in keyof T]?: T[key];
};

export type SelectCondition<T> = {
  [key in keyof T]?: boolean;
};

export interface IGenericParams<T> {
  tableName: TableName;
  whereCondition?: WhereCondition<T>;
  selectCondition?: SelectCondition<T>;
}

export type CreateGenericInput<T> = {
  [key in keyof Omit<T, "id" | "createdAt" | "updatedAt">]: T[key];
};

export type CreateGenericWithCurrentUserInput<T> = {
  [key in keyof Omit<T, "id" | "createdAt" | "updatedAt" | "userId">]: T[key];
};

export type UpdateGenericInput<T> = {
  [key in keyof Partial<T>]: T[key];
};

export type TableName =
  | "account"
  | "transaction"
  | "budget"
  | "goal"
  | "reminder";

export type Page =
  | "Dashboard"
  | "Accounts"
  | "Budgets"
  | "Goals"
  | "Transactions"
  | "Reports"
  | "Settings";

export interface IPage {
  label: Page;
  icon: IconType;
  link: string;
}

export interface IRecaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes": string[];
}

export interface IGetPaginatedTransactionsParams
  extends IPaginatedActionParams {
  transactionType?: string;
  accountId?: string;
  sortBy: "amount" | "createdAt";
  sortDirection?: "asc" | "desc";
  createdAtStart?: Date;
  createdAtEnd?: Date;
  createdAtOperator?: "equals" | "before" | "after" | "range";
  category?: TransactionCategory;
}

export type TransactionResponse = {
  id: string;
  amount: number;
  description: string;
  createdAt: Date;
  category: TransactionCategory;
  updatedAt: Date;
  accountId: string;
  userId: string;
  accountName: string;
};

export interface IGetPaginatedTransactionsResponse extends IPaginatedResponse {
  transactions: TransactionResponse[];
}
