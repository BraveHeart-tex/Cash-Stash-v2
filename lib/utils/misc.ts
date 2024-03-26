import { IGetPaginatedTransactionsParams } from "@/actions/types";
import { ITransactionPageSearchParams } from "@/app/(dashboard)/transactions/page";
import { TransactionCategory } from "@/entities/transaction";

export function createGetPaginatedTransactionsParams(
  searchParams: ITransactionPageSearchParams
): IGetPaginatedTransactionsParams {
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
    category: category as TransactionCategory,
    pageNumber: page ? parseInt(page) : 1,
    query,
  };
}
