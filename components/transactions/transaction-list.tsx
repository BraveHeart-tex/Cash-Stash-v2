import TransactionCard from "@/components/transactions/transaction-card";
import { TransactionWithCategoryAndAccountName } from "@/server/types";

const TransactionList = ({
  transactions,
}: {
  transactions: TransactionWithCategoryAndAccountName[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {transactions.map((transaction) => (
        <TransactionCard transaction={transaction} key={transaction.id} />
      ))}
    </div>
  );
};

export default TransactionList;
