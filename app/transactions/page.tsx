import { getPaginatedTransactions } from "@/actions/transaction";
import TransactionList from "@/components/transactions/transaction-list";
import CreateTransactionButton from "@/components/create-buttons/create-transaction-button";
import TransactionsNotFound from "@/components/transactions-not-found";

export interface SearchParams {
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
  searchParams: SearchParams;
}) => {
  const actionParams = {
    transactionType: searchParams.transactionType as
      | "all"
      | "income"
      | "expense",
    accountId: searchParams.accountId,
    sortBy: searchParams.sortBy as "createdAt" | "amount",
    sortDirection: searchParams.sortDirection as "asc" | "desc",
    amountStart: searchParams.amountStart,
    amountEnd: searchParams.amountEnd,
    amountOperator: searchParams.amountOperator as
      | "equals"
      | "lessThan"
      | "greaterThan"
      | "range",
    createdAtStart: searchParams.createdAtStart,
    createdAtEnd: searchParams.createdAtEnd,
    createdAtOperator: searchParams.createdAtOperator as
      | "equals"
      | "before"
      | "after"
      | "range",
    category: searchParams.category,
    page: searchParams.page,
    query: searchParams.query,
  };

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
