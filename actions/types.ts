import {
  Budget,
  UserAccount,
  NotificationCategory,
  UserAccountCategory,
} from "@prisma/client";

export interface IGetPaginatedAccountActionParams {
  pageNumber: number;
  query?: string;
  category?: UserAccountCategory;
}

export interface IGetPaginatedAccountActionReturnType {
  accounts: UserAccount[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

export interface IGetPaginatedBudgetsActionParams {
  pageNumber: number;
  query?: string;
  category?: NotificationCategory;
}

export interface IGetPaginatedBudgetsActionReturnType {
  budgets: Budget[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

export type SerializedUserAccount = Omit<
  UserAccount,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};
