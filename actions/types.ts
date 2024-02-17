import {
  Budget,
  UserAccount,
  NotificationCategory,
  UserAccountCategory,
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
  category?: UserAccountCategory;
}

export interface IGetPaginatedAccountActionReturnType
  extends IPaginatedReturnType {
  accounts: UserAccount[];
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

export interface IGetPaginatedGoalsActionParams
  extends IPaginatedActionParams {}

export interface IGetPaginatedGoalsActionReturnType
  extends IPaginatedReturnType {
  goals: Goal[];
}

export type SerializedUserAccount = Omit<
  UserAccount,
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
