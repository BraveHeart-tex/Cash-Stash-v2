"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SerializedTransaction } from "@/app/redux/features/transactionsSlice";
import { useAppDispatch } from "../redux/hooks";
import { setSelectedTab } from "../redux/features/navigationTabsSlice";
import { FaExchangeAlt } from "react-icons/fa";
import TransactionCard from "./TransactionsPage/TransactionCard";

interface ITransactionHistoryProps {
  transactions: SerializedTransaction[] | null;
}

const TransactionHistory = ({ transactions }: ITransactionHistoryProps) => {
  const dispatch = useAppDispatch();

  if (!transactions || transactions.length === 0) {
    return (
      <article className="flex h-[500px] items-center justify-center">
        <div>
          <p className="text-primary">No transactions found.</p>
          <Button
            className="font-semibold text-md mt-3 flex items-center gap-[14px]"
            onClick={() =>
              dispatch(setSelectedTab({ selectedTab: "Transactions" }))
            }
          >
            <FaExchangeAlt size={18} /> Create a transaction
          </Button>
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
