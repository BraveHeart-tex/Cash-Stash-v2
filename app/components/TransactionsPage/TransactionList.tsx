import { SerializedTransaction } from "@/app/redux/features/transactionsSlice";
import TransactionCard from "./TransactionCard";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";
import MotionDiv from "@/components/animation/MotionDiv";

const TransactionList = ({
  transactions,
}: {
  transactions: SerializedTransaction[];
}) => {
  const renderNoTransactionsState = () => (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.5, type: "just" }}
      className="flex justify-center items-start flex-col gap-4 my-4 lg:mt-0"
    >
      <h2 className="inline-block text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
        No transactions found.
      </h2>
      <p>
        You can try again by removing any existing filters or creating a new
        transaction below.
      </p>
    </MotionDiv>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {transactions.length === 0 && renderNoTransactionsState()}
      <AnimatePresenceClient>
        {transactions?.map((transaction) => (
          <TransactionCard transaction={transaction} key={transaction.id} />
        ))}
      </AnimatePresenceClient>
    </div>
  );
};

export default TransactionList;
