import { IconType } from "react-icons/lib";
import { AccountCategory } from "@/entities/account";
import { BudgetCategory } from "@/entities/budget";
import {
  AccountSelectModel,
  BudgetSelectModel,
  GoalSelectModel,
  ReminderSelectModel,
  TransactionSelectModel,
} from "@/lib/database/schema";

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

export interface TransactionWithAccount extends TransactionSelectModel {
  account: Partial<AccountSelectModel>;
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
  accounts: AccountWithTransactions[];
}

export interface IGetPaginatedBudgetsParams extends IPaginatedActionParams {
  category?: BudgetCategory;
  sortBy?: string;
  sortDirection?: string;
}

export interface IGetPaginatedBudgetsResponse extends IPaginatedResponse {
  budgets: BudgetSelectModel[];
}

export interface IGetPaginatedGoalsParams extends IPaginatedActionParams {
  sortBy?: string;
  sortDirection?: string;
}

export interface IGetPaginatedGoalsResponse extends IPaginatedResponse {
  goals: GoalSelectModel[];
}

export interface IGetPaginatedRemindersParams extends IPaginatedActionParams {
  startDate?: string;
  endDate?: string;
}

export interface IGetPaginatedRemindersResponse extends IPaginatedResponse {
  reminders: ReminderSelectModel[];
}

export type SerializedUserAccount = Omit<
  AccountSelectModel,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface GenericFilterOption<T> {
  label: string;
  data: T;
  icon: React.JSX.Element;
}

export type UpdateBudgetResponse = {
  budget?: BudgetSelectModel;
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
  TransactionSelectModel,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  account?: Partial<AccountSelectModel>;
};

export type SerializedReminder = Omit<
  ReminderSelectModel,
  "createdAt" | "updatedAt" | "reminderDate"
> & {
  createdAt: string;
  updatedAt: string;
  reminderDate: string;
};

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
  accountId?: number;
  sortBy: "amount" | "createdAt";
  sortDirection?: "asc" | "desc";
  createdAtStart?: Date;
  createdAtEnd?: Date;
  createdAtOperator?: "equals" | "before" | "after" | "range";
  category?: TransactionSelectModel["category"];
}

export interface IGetPaginatedTransactionsResponse extends IPaginatedResponse {
  transactions: (TransactionSelectModel & { accountName: string })[];
}

export interface AccountWithTransactions extends AccountSelectModel {
  transactions: TransactionSelectModel[];
}

export interface MonthlyTransactionsData {
  date: string;
  income: number;
  expense: number;
}

export interface TransactionsWithAccountName extends TransactionSelectModel {
  accountName: string;
}
