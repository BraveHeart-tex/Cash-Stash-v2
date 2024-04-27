import { TransactionSelectModel } from "@/lib/database/schema";
import {
  BasePaginatedActionParams,
  BaseValidatedResponse,
} from "@/typings/baseTypes";

export type CreateTransactionReturnType = Promise<
  BaseValidatedResponse<TransactionSelectModel>
>;

export type UpdateTransactionReturnType = Promise<
  BaseValidatedResponse<TransactionSelectModel>
>;

export type GetPaginatedTransactionsParams = BasePaginatedActionParams & {
  transactionType?: string;
  accountId?: number;
  sortBy: "amount" | "createdAt";
  sortDirection?: "asc" | "desc";
  createdAtStart?: Date;
  createdAtEnd?: Date;
  createdAtOperator?: "equals" | "before" | "after" | "range";
  categoryId?: number;
};

export type GetPaginatedTransactionsReturnType = Promise<
  BasePaginatedResponse & {
    transactions: TransactionWithCategoryAndAccountName[];
  }
>;

export type TransactionWithCategoryAndAccountName = TransactionSelectModel & {
  category: string;
} & { accountName: string };
