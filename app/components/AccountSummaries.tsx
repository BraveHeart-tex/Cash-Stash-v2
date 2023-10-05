"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchCurrentUserAccounts } from "@/app/redux/features/userAccountSlice";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { setSelectedTab } from "../redux/features/navigationTabsSlice";

const AccountSummaries = () => {
  const dispatch = useAppDispatch();
  const { currentUserAccounts: accounts, isLoading } = useAppSelector(
    (state) => state.userAccountReducer
  );

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-[300px] lg:h-[350px]" />
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div>
        <p className="text-foreground">No accounts found.</p>
        <Button
          className="font-bold text-md mt-3 hover:bg-foreground hover:text-muted"
          variant={"secondary"}
          onClick={() => dispatch(setSelectedTab("Accounts"))}
        >
          Get started by creating an account
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <div className="p-4 rounded-md shadow-lg bg-card" key={account.name}>
            <p className="font-bold mb-2">{account.name}</p>
            <p className="text-lg">Balance: {account.balance}₺</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountSummaries;
