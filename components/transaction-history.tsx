import TransactionCard from "./transactions/transaction-card";
import CreateTransactionButton from "./create-buttons/create-transaction-button";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import MotionDiv from "@/components/animations/motion-div";
import { TransactionSelectModel } from "@/lib/database/schema";
import { Button } from "./ui/button";
import Link from "next/link";
import { PAGE_ROUTES } from "@/lib/constants";

type TransactionHistoryProps = {
  transactions: (TransactionSelectModel & { accountName: string })[] | null;
};

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
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
    <div className="pr-2 min-h-[500px] max-h-[500px] overflow-y-auto">
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresenceClient>
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </AnimatePresenceClient>
        <Button className="w-max ml-auto">
          <Link href={PAGE_ROUTES.TRANSACTIONS_ROUTE}>
            View All Transactions
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TransactionHistory;
