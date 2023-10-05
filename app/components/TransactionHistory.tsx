"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SerializedTransaction } from "@/app/redux/features/transactionsSlice";
import { useAppDispatch } from "../redux/hooks";
import { setSelectedTab } from "../redux/features/navigationTabsSlice";

interface ITransactionHistoryProps {
  transactions: SerializedTransaction[] | null;
}

const TransactionHistory = ({ transactions }: ITransactionHistoryProps) => {
  const dispatch = useAppDispatch();

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-2 min-h-[500px] max-h-[500px] overflow-y-scroll scrollbar-hide">
        <p className="text-primary">No transactions found.</p>
        <Button
          className="font-bold text-md mt-3 hover:bg-foreground hover:text-muted"
          variant="secondary"
          onClick={() => dispatch(setSelectedTab("Transactions"))}
        >
          Get started by creating a transaction
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2 min-h-[500px] max-h-[500px] overflow-y-scroll scrollbar-hide">
      <div className="grid grid-cols-1 gap-4">
        {transactions.map((transaction) => (
          <div
            className="p-4 rounded-md shadow-xl bg-card"
            key={transaction.id}
          >
            <div className="flex items-center gap-2 w-full justify-between">
              <p className="font-bold text-xl">{transaction.description}</p>
              <Badge
                className={cn(
                  "cursor-pointer select-none",
                  transaction.isIncome
                    ? "bg-green-500 hover:bg-green-400"
                    : "bg-red-400 hover:bg-red-500"
                )}
              >
                {transaction.isIncome ? "Income" : "Expense"}
              </Badge>
            </div>

            <p>{transaction.createdAt}</p>
            <p>{transaction.amount}₺</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
