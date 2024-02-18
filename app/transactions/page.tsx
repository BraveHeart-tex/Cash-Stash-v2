import { getGenericListByCurrentUser } from "@/actions/generic";
import { SerializedUserAccount } from "@/actions/types";
import { searchTransactions } from "@/actions";
import TransactionsFilter from "@/components/transactions/transactions-filter";
import TransactionsSort from "@/components/transactions/transactions-sort";
import TransactionList from "@/components/transactions/transaction-list";
import CreateTransactionButton from "../../components/CreateButtons/create-transaction-button";
import MotionDiv from "@/components/animations/motion-div";

export interface SearchParams {
  transactionType: string;
  accountId: string;
  sortBy: string;
  sortDirection: string;
}

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
  let result = await searchTransactions({
    transactionType: transactionType as "all" | "income" | "expense",
    accountId,
    sortBy: sortBy as "createdAt" | "amount",
    sortDirection: sortDirection as "asc" | "desc",
  });

  const currentUserAccounts =
    await getGenericListByCurrentUser<SerializedUserAccount>({
      tableName: "userAccount",
    });

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: 200, scale: 1.2 }}
          transition={{ duration: 0.3, type: "just" }}
        >
          <h3 className="text-4xl mb-4 text-primary">Transactions</h3>

          <div className="grid h-[50vh] grid-cols-1 lg:grid-cols-3 lg:grid-rows-1 ">
            <div className="col-span-3 lg:col-span-1">
              <div className="flex justify-center items-start gap-1 flex-col">
                <TransactionsFilter
                  currentUserAccounts={currentUserAccounts?.data || []}
                />
                <TransactionsSort />
                <CreateTransactionButton />
              </div>
            </div>
            <div className="col-span-3 lg:col-span-2">
              <div>
                <TransactionList transactions={result.transactions || []} />
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </main>
  );
};

export default TransactionsPage;
