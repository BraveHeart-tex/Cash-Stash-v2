import {
  Budget,
  Account,
  AccountCategory,
  Goal,
  BudgetCategory,
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

export interface IGetPaginatedAccountActionParams
  extends IPaginatedActionParams {
  sortBy?: string;
  sortDirection?: string;
  category?: AccountCategory;
}

export interface IGetPaginatedAccountActionResponse extends IPaginatedResponse {
  accounts: Account[];
}

export interface IGetPaginatedBudgetsActionParams
  extends IPaginatedActionParams {
  category?: BudgetCategory;
  sortBy?: string;
  sortDirection?: string;
}

export interface IGetPaginatedBudgetsActionResponse extends IPaginatedResponse {
  budgets: Budget[];
}

export interface IGetPaginatedGoalsActionParams extends IPaginatedActionParams {
  sortBy?: string;
  sortDirection?: string;
}

export interface IGetPaginatedGoalsActionResponse extends IPaginatedResponse {
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
