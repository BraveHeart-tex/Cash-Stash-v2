import {
  GetPaginatedTransactionsParams,
  TransactionPageSearchParams,
} from "@/server/types";
import { TransactionSelectModel } from "@/lib/database/schema";

export function createGetPaginatedTransactionsParams(
  searchParams: TransactionPageSearchParams
): GetPaginatedTransactionsParams {
  const {
    transactionType,
    accountId,
    sortBy,
    sortDirection,
    category,
    page,
    query,
  } = searchParams;

  return {
    transactionType,
    accountId: accountId ? parseInt(accountId) : undefined,
    sortBy: (sortBy || "createdAt") as "amount" | "createdAt",
    sortDirection: (sortDirection || "desc") as "asc" | "desc",
    category: category as TransactionSelectModel["category"],
    pageNumber: page ? parseInt(page) : 1,
    query,
  };
}
