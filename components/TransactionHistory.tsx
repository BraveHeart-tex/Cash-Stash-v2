import { SerializedTransaction } from "@/app/redux/features/transactionsSlice";
import TransactionCard from "./TransactionsPage/TransactionCard";
import CreateTransactionButton from "./CreateButtons/CreateTransactionButton";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";
import MotionDiv from "@/components/animation/MotionDiv";

interface ITransactionHistoryProps {
  transactions: SerializedTransaction[] | null;
}

const TransactionHistory = ({ transactions }: ITransactionHistoryProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <article className="flex h-[500px] items-center justify-center">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary">No transactions found.</p>
          <CreateTransactionButton />
        </MotionDiv>
      </article>
    );
  }

  return (
    <div className="p-2 min-h-[500px] max-h-[500px] overflow-y-scroll scrollbar-hide">
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresenceClient>
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </AnimatePresenceClient>
      </div>
    </div>
  );
};

export default TransactionHistory;
