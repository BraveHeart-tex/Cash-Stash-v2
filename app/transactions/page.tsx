import { getPaginatedTransactions } from "@/data/transaction";
import TransactionList from "@/components/transactions/transaction-list";
import CreateTransactionButton from "@/components/create-buttons/create-transaction-button";
import TransactionsNotFound from "@/components/transactions-not-found";
import RouteSearchInput from "@/components/route-search-input";
import { createGetPaginatedTransactionsParams } from "@/lib/utils";

export interface ITransactionPageSearchParams {
  transactionType?: string;
  accountId?: string;
  sortBy?: string;
  sortDirection?: string;
  amountStart?: number;
  amountEnd?: number;
  amountOperator?: "equals" | "lessThan" | "greaterThan" | "range";
  createdAtStart?: Date;
  createdAtEnd?: Date;
  createdAtOperator?: "equals" | "before" | "after" | "range";
  category?: string;
  page?: string;
  query?: string;
}

const TransactionsPage = async ({
  searchParams,
}: {
  searchParams: ITransactionPageSearchParams;
}) => {
  const actionParams = createGetPaginatedTransactionsParams(searchParams);

  let result = await getPaginatedTransactions(actionParams);

  const pageHasParams = Object.keys(actionParams)
    .filter((key) => key !== "page")
    .some((key: string) => actionParams[key as keyof typeof actionParams]);

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="flex items-center gap-2 justify-between mb-4">
          <h3 className="text-4xl text-primary">Transactions</h3>
          <CreateTransactionButton className="mt-0" />
        </div>
        <div className="flex items-center justify-between">
          <RouteSearchInput placeholder="Search by description" />
        </div>
        <div>
          {result.transactions && result.transactions.length > 0 ? (
            <TransactionList transactions={result.transactions || []} />
          ) : (
            <TransactionsNotFound pageHasParams={pageHasParams} />
          )}
        </div>
      </div>
    </main>
  );
};

export default TransactionsPage;
