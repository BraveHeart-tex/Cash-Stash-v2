import TransactionCard from "@/components/transactions/transaction-card";
import { TransactionWithCategoryAndAccountName } from "@/typings/transactions";

type TransactionListProps = {
  transactions: TransactionWithCategoryAndAccountName[];
};

const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {transactions.map((transaction) => (
        <TransactionCard transaction={transaction} key={transaction.id} />
      ))}
    </div>
  );
};

export default TransactionList;
