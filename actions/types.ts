import {
  Budget,
  Account,
  NotificationCategory,
  AccountCategory,
  Goal,
} from "@prisma/client";

interface IPaginatedReturnType {
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

export interface IGetPaginatedAccountActionReturnType
  extends IPaginatedReturnType {
  accounts: Account[];
}

export interface IGetPaginatedBudgetsActionParams
  extends IPaginatedActionParams {
  category?: NotificationCategory;
  sortBy?: string;
  sortDirection?: string;
}

export interface IGetPaginatedBudgetsActionReturnType
  extends IPaginatedReturnType {
  budgets: Budget[];
}

export interface IGetPaginatedGoalsActionParams extends IPaginatedActionParams {
  sortBy?: string;
  sortDirection?: string;
}

export interface IGetPaginatedGoalsActionReturnType
  extends IPaginatedReturnType {
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
