import {
  GetPaginatedTransactionsParams,
  TransactionPageSearchParams,
} from "@/server/types";

export function createGetPaginatedTransactionsParams(
  searchParams: TransactionPageSearchParams
): GetPaginatedTransactionsParams {
  const {
    transactionType,
    accountId,
    sortBy,
    sortDirection,
    categoryId,
    page,
    query,
  } = searchParams;

  return {
    transactionType,
    accountId: accountId ? parseInt(accountId) : undefined,
    sortBy: (sortBy || "createdAt") as "amount" | "createdAt",
    sortDirection: (sortDirection || "desc") as "asc" | "desc",
    categoryId: categoryId || undefined,
    pageNumber: page ? parseInt(page) : 1,
    query,
  };
}
