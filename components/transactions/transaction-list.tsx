import TransactionCard from "./transaction-card";
import { Transaction } from "@prisma/client";

const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {transactions.map((transaction) => (
        <TransactionCard transaction={transaction} key={transaction.id} />
      ))}
    </div>
  );
};

export default TransactionList;
