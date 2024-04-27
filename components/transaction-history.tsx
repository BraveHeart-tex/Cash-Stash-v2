import TransactionCard from "@/components/transactions/transaction-card";
import CreateTransactionButton from "@/components/create-buttons/create-transaction-button";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PAGE_ROUTES } from "@/lib/constants";
import { TransactionWithCategoryAndAccountName } from "@/typings/transactions";

type TransactionHistoryProps = {
  transactions: TransactionWithCategoryAndAccountName[] | null;
};

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <article className="flex h-[540px] flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-primary">No transactions found.</p>
          <CreateTransactionButton className="mt-3" />
        </div>
      </article>
    );
  }

  return (
    <div className="max-h-[500px] min-h-[500px] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresenceClient>
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </AnimatePresenceClient>
        <Button className="ml-auto w-max">
          <Link href={PAGE_ROUTES.TRANSACTIONS_ROUTE}>
            View All Transactions
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TransactionHistory;
