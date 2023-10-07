"use client";
import { useEffect } from "react";
import { fetchTransactions } from "@/app/redux/features/transactionsSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import TransactionCard from "./TransactionCard";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionList = () => {
  const { data, filteredData, isLoading } = useAppSelector(
    (state) => state.transactionsReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

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

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (!isLoading && data?.length === 0) {
    return renderNoTransactionsState();
  }

  if (filteredData?.length === 0) {
    return renderNoTransactionsState();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredData && filteredData?.length > 0
        ? filteredData?.map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))
        : data?.map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))}
    </div>
  );
};

export default TransactionList;
