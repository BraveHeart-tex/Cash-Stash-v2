import TransactionsFilter from "@/app/components/TransactionsPage/TransactionsFilter";
import TransactionsSort from "@/app/components/TransactionsPage/TransactionsSort";
import TransactionList from "@/app/components/TransactionsPage/TransactionList";
import CreateTransactionButton from "../components/CreateButtons/CreateTransactionButton";
import { SerializedTransaction } from "../redux/features/transactionsSlice";
import { SerializedUserAccount } from "../redux/features/userAccountSlice";
import MotionDiv from "@/components/animation/MotionDiv";

const TransactionsListPage = ({
  transactions,
  currentUserAccounts,
}: {
  transactions: SerializedTransaction[];
  currentUserAccounts: SerializedUserAccount[];
}) => {
  return (
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
              <TransactionsFilter currentUserAccounts={currentUserAccounts} />
              <TransactionsSort />
              <CreateTransactionButton />
            </div>
          </div>
          <div className="col-span-3 lg:col-span-2">
            <div>
              <TransactionList transactions={transactions} />
            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

export default TransactionsListPage;
