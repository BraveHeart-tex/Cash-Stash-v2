import { getGenericListByCurrentUser } from "@/actions/generic";
import TransactionsListPage from "./TransactionsClient";
import { SerializedUserAccount } from "../redux/features/userAccountSlice";
import { searchTransactions } from "@/actions";

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
      <TransactionsListPage
        transactions={result?.transactions || []}
        currentUserAccounts={currentUserAccounts?.data || []}
      />
    </main>
  );
};

export default TransactionsPage;
