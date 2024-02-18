import { getPaginatedTransactions } from "@/actions";
import TransactionList from "@/components/transactions/transaction-list";
import CreateTransactionButton from "@/components/CreateButtons/create-transaction-button";
import TransactionsNotFound from "@/components/transactions-not-found";

export interface SearchParams {
  transactionType: string;
  accountId: string;
  sortBy: string;
  sortDirection: string;
}

// amount between
// createdAt between
// by category

const TransactionsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const {
    transactionType = "all",
    accountId = "",
    sortBy = "createdAt",
    sortDirection = "desc",
  } = searchParams;

  let result = await getPaginatedTransactions({
    transactionType: transactionType as "all" | "income" | "expense",
    accountId,
    sortBy: sortBy as "createdAt" | "amount",
    sortDirection: sortDirection as "asc" | "desc",
  });

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
            <TransactionsNotFound pageHasParams={true} />
          )}
        </div>
      </div>
    </main>
  );
};

export default TransactionsPage;
