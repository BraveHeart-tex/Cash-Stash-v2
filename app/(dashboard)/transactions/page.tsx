import { getPaginatedTransactions } from "@/server/transaction";
import TransactionList from "@/components/transactions/transaction-list";
import { getCurrentUserAccountsThatHaveTransactions } from "@/server/account";
import RoutePaginationControls from "@/components/route-pagination-controls";
import TransactionsPageHeader from "@/components/transactions/transactions-page-header";
import TransactionsPageFilters from "@/components/transactions/transactions-page-filters";
import TransactionsNotFoundMessage from "@/components/transactions/transactions-not-found-message";

export type TransactionPageSearchParams = {
  transactionType?: string;
  accountId?: string;
  sortBy?: string;
  sortDirection?: string;
  categoryId?: number;
  page?: string;
  query?: string;
};

type TransactionsPageProps = {
  searchParams: TransactionPageSearchParams;
};

const TransactionsPage = async ({ searchParams }: TransactionsPageProps) => {
  const {
    transactionType,
    accountId,
    sortBy,
    sortDirection,
    categoryId,
    page,
    query,
  } = searchParams;
  const actionParams = {
    transactionType,
    accountId: accountId ? parseInt(accountId) : undefined,
    sortBy: (sortBy || "createdAt") as "amount" | "createdAt",
    sortDirection: (sortDirection || "desc") as "asc" | "desc",
    categoryId: categoryId || undefined,
    pageNumber: page ? parseInt(page) : 1,
    query,
  };

  const [transactionsResponse, usersAccounts] = await Promise.all([
    getPaginatedTransactions(actionParams),
    getCurrentUserAccountsThatHaveTransactions(),
  ]);

  const accountsFilterDataset = usersAccounts.map((account) => ({
    label: account.name,
    value: account.id.toString(),
  }));

  const pageHasParams = Object.keys(searchParams)
    .filter((key) => key !== "page")
    .some(
      (key: string) => !!searchParams[key as keyof TransactionPageSearchParams]
    );

  return (
    <main>
      <div className="mx-auto p-4 lg:max-w-[1300px] xl:max-w-[1600px] ">
        <TransactionsPageHeader />
        <TransactionsPageFilters
          shouldRenderPopover={transactionsResponse.transactions.length > 1}
          accountsFilterDataset={accountsFilterDataset}
        />
        <div className="mt-2 h-[calc(100vh-470px)] w-full overflow-auto pr-2 lg:h-[calc(100vh-400px)]">
          {transactionsResponse.transactions.length > 0 ? (
            <TransactionList transactions={transactionsResponse.transactions} />
          ) : (
            <TransactionsNotFoundMessage pageHasParams={pageHasParams} />
          )}
        </div>
      </div>
      {transactionsResponse.totalPages > 1 && (
        <RoutePaginationControls {...transactionsResponse} />
      )}
    </main>
  );
};

export default TransactionsPage;
