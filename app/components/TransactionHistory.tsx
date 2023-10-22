import { SerializedTransaction } from "@/app/redux/features/transactionsSlice";
import TransactionCard from "./TransactionsPage/TransactionCard";
import CreateTransactionButton from "./CreateButtons/CreateTransactionButton";

interface ITransactionHistoryProps {
  transactions: SerializedTransaction[] | null;
}

const TransactionHistory = ({ transactions }: ITransactionHistoryProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <article className="flex h-[500px] items-center justify-center">
        <div>
          <p className="text-primary">No transactions found.</p>
          <CreateTransactionButton />
        </div>
      </article>
    );
  }

  return (
    <div className="p-2 min-h-[500px] max-h-[500px] overflow-y-scroll scrollbar-hide">
      <div className="grid grid-cols-1 gap-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
