"use client";
import { SerializedTransaction } from "@/app/redux/features/transactionsSlice";
import { SerializedUserAccount } from "@/actions/types";
import TransactionsFilter from "../TransactionsPage/TransactionsFilter";
import TransactionsSort from "../TransactionsPage/TransactionsSort";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, thousandSeparator } from "@/lib/utils";
import ResponsiveChartContainer from "@/app/ResponsiveChartContainer";
import { useEffect, useState } from "react";

export interface MonthlyData {
  monthlyTransactionsData: {
    date: string;
    income: number;
    expense: number;
  }[];
  transactions: SerializedTransaction[];
  currentUserAccounts: SerializedUserAccount[];
}

const ReportTable = ({
  monthlyTransactionsData,
  transactions,
  currentUserAccounts,
}: MonthlyData) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderTableBody = () => {
    return (
      <TableBody className={"overflow-y-scroll"}>
        {transactions && transactions.length > 0 ? (
          <>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="even:bg-secondary hover:bg-muted cursor-pointer"
              >
                <TableCell>{transaction.createdAt}</TableCell>
                <TableCell
                  className={cn(
                    transaction.isIncome ? "text-green-500" : "text-red-500"
                  )}
                >
                  {thousandSeparator(transaction.amount)}$
                </TableCell>
                <TableCell>
                  {currentUserAccounts &&
                    currentUserAccounts.map((account) =>
                      account.id === transaction.accountId ? account.name : ""
                    )}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  {" "}
                  {transaction.isIncome ? "Income" : "Expense"}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableRow />
              </TableRow>
            ))}
          </>
        ) : null}
      </TableBody>
    );
  };

  return (
    <div>
      <h3 className="my-4 text-lg">Transaction History Report</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4">
        <div className="flex justify-center flex-col">
          <TransactionsFilter currentUserAccounts={currentUserAccounts} />
          <TransactionsSort />
        </div>
        <Table>
          <TableCaption>List of your Transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          {transactions.length === 0 && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No transactions found to display.
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {renderTableBody()}
        </Table>
      </div>
      <div className="mt-4">
        <ResponsiveChartContainer
          monthlyTransactionsData={monthlyTransactionsData}
        />
      </div>
    </div>
  );
};

export default ReportTable;
