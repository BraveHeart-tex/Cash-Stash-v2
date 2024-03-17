"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ResponsiveChartContainer from "@/app/chart-container";
import { useEffect, useState } from "react";
import {
  AccountSelectModel,
  TransactionSelectModel,
} from "@/lib/database/schema";
import { cn } from "@/lib/utils/stringUtils/cn";
import { thousandSeparator } from "@/lib/utils/numberUtils/thousandSeparator";

export interface MonthlyData {
  monthlyTransactionsData: {
    date: string;
    income: number;
    expense: number;
  }[];
  transactions: TransactionSelectModel[];
  currentUserAccounts: AccountSelectModel[];
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
                    transaction.amount > 0 ? "text-green-500" : "text-red-500"
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
                  {transaction.amount > 0 ? "Income" : "Expense"}
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
        <div className="flex justify-center flex-col"></div>
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
