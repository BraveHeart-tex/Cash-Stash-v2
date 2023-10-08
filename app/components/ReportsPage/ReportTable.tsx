"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchTransactions } from "@/app/redux/features/transactionsSlice";
import { fetchCurrentUserAccounts } from "@/app/redux/features/userAccountSlice";
import { useEffect } from "react";
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
import { cn } from "@/lib/utils";
import ResponsiveChartContainer from "@/app/ResponsiveChartContainer";

export interface MonthlyData {
  monthlyTransactionsData: {
    date: string;
    income: number;
    expense: number;
  }[];
}

const ReportTable = ({ monthlyTransactionsData }: MonthlyData) => {
  const dispatch = useAppDispatch();
  const {
    // data,
    filteredData: transactions,
    isLoading,
  } = useAppSelector((state) => state.transactionsReducer);
  const { currentUserAccounts } = useAppSelector(
    (state) => state.userAccountReducer
  );

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  console.log(transactions);

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
                  {transaction.amount}₺
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
          <TransactionsFilter />
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
          {isLoading && (
            <TableBody>
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            </TableBody>
          )}
          {!isLoading && !transactions && (
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
