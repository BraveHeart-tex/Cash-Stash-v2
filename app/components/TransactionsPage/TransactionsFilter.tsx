"use client";
import {
  setFilterType,
  setFilterAccount,
  updateFilteredData,
} from "@/app/redux/features/transactionsSlice";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchTransactions } from "@/app/redux/features/transactionsSlice";
import { fetchCurrentUserAccounts } from "@/app/redux/features/userAccountSlice";
import GenericSelect from "@/components/GenericSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TransactionsFilter = () => {
  const dispatch = useAppDispatch();
  const { currentUserAccounts } = useAppSelector(
    (state) => state.userAccountReducer
  );

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setFilterType(""));
    dispatch(setFilterAccount(""));
  }, [dispatch]);

  const handleTypeChange = (value: string) => {
    dispatch(setFilterType(value));
    dispatch(updateFilteredData());
  };

  const handleAccountChange = (value: string) => {
    dispatch(setFilterAccount(value));
    dispatch(updateFilteredData());
  };

  const TransactionTypeOptions = [
    { value: "", label: "All" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  const AccountOptions = [
    { value: "", label: "All" },
    ...(currentUserAccounts?.map((account) => ({
      value: account.id.toString(),
      label: account.name,
    })) ?? []),
  ];

  return (
    <Card className="min-h-[10rem] w-full lg:w-[75%] mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Filter Transactions</CardTitle>
        <CardDescription>
          Filter transactions by transaction type and account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <p className="text-[14px] xl:text-md font-semibold">
              By Transaction Type
            </p>
            <GenericSelect
              placeholder={"Transaction Type"}
              options={TransactionTypeOptions}
              onChange={handleTypeChange}
              selectLabel={"Transaction Type"}
            />
          </div>
          <div>
            <p className="text-[14px] xl:text-md font-semibold">By Account</p>
            <GenericSelect
              placeholder={"Account"}
              options={AccountOptions}
              onChange={handleAccountChange}
              selectLabel={"Account"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsFilter;
