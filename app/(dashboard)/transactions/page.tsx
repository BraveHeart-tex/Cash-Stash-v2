import { getPaginatedTransactions } from "@/server/transaction";
import TransactionList from "@/components/transactions/transaction-list";
import { getCurrentUserAccountsThatHaveTransactions } from "@/server/account";
import { createGetPaginatedTransactionsParams } from "@/lib/utils/misc";
import { generateOptionsFromEnums } from "@/lib/utils/stringUtils/generateOptionsFromEnums";
import { transactions } from "@/lib/database/schema";
import RoutePaginationControls from "@/components/route-pagination-controls";
import TransactionsPageHeader from "@/components/transactions/transactions-page-header";
import TransactionsPageFilters from "@/components/transactions/transactions-page-filters";
import TransactionsNotFoundMessage from "@/components/transactions/transactions-not-found-message";

export type TransactionPageSearchParams = {
  transactionType?: string;
  accountId?: string;
  sortBy?: string;
  sortDirection?: string;
  category?: string;
  page?: string;
  query?: string;
};

type TransactionsPageProps = {
  searchParams: TransactionPageSearchParams;
};

const TransactionsPage = async ({ searchParams }: TransactionsPageProps) => {
  const actionParams = createGetPaginatedTransactionsParams(searchParams);

  const [transactionsResponse, usersAccounts] = await Promise.all([
    getPaginatedTransactions(actionParams),
    getCurrentUserAccountsThatHaveTransactions(),
  ]);

  const accountsFilterDataset = usersAccounts.map((account) => ({
    label: account.name,
    value: account.id.toString(),
  }));

  const categoryFilterDataset = generateOptionsFromEnums(
    transactions.category.enumValues
  );

  const pageHasParams = Object.keys(searchParams)
    .filter((key) => key !== "page")
    .some(
      (key: string) => !!searchParams[key as keyof TransactionPageSearchParams]
    );

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <TransactionsPageHeader />
        <TransactionsPageFilters
          shouldRenderPopover={transactionsResponse.transactions.length > 1}
          accountsFilterDataset={accountsFilterDataset}
          categoryFilterDataset={categoryFilterDataset}
        />
        <div className="max-h-[500px] overflow-auto w-full pr-2">
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
