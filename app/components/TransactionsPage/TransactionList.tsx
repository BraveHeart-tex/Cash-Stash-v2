import { SerializedTransaction } from "@/app/redux/features/transactionsSlice";
import TransactionCard from "./TransactionCard";

const TransactionList = ({
  transactions,
}: {
  transactions: SerializedTransaction[];
}) => {
  const renderNoTransactionsState = () => (
    <div className="flex justify-center items-start flex-col gap-4 my-4 lg:mt-0">
      <h2 className="inline-block text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
        No transactions found.
      </h2>
      <p>
        You can try again by removing any existing filters or creating a new
        transaction below.
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {transactions.length === 0 && renderNoTransactionsState()}
      {transactions?.map((transaction) => (
        <TransactionCard transaction={transaction} key={transaction.id} />
      ))}
    </div>
  );
};

export default TransactionList;
