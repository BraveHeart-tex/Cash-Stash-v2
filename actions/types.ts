import { UserAccount } from "@prisma/client";

export interface IGetPaginatedAccountActionParams {
  pageNumber: number;
  query?: string;
}

export interface IGetPaginatedAccountActionReturnType {
  accounts: UserAccount[];
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
