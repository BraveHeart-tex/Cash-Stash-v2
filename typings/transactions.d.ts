import type { TransactionSelectModel } from "@/lib/database/schema";
import type { TransactionSchemaType } from "@/schemas/transaction-schema";
import type {
  BasePaginatedActionParams,
  BasePaginatedResponse,
  BaseValidatedResponse,
} from "@/typings/baseTypes";

export type CreateTransactionReturnType =
  BaseValidatedResponse<TransactionSelectModel>;

export type UpdateTransactionReturnType =
  BaseValidatedResponse<TransactionSelectModel>;

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

export type GetPaginatedTransactionsReturnType = BasePaginatedResponse & {
  transactions: TransactionWithCategoryAndAccountName[];
};

export type TransactionWithCategoryAndAccountName = TransactionSelectModel & {
  category: string;
} & { accountName: string };

export type UpdateTransactionParam = {
  transactionId: number;
  values: TransactionSchemaType;
  oldTransaction: TransactionSelectModel;
};
