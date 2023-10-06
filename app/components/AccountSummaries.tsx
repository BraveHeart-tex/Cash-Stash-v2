"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchCurrentUserAccounts } from "@/app/redux/features/userAccountSlice";
import { Button } from "@/components/ui/button";
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
      <article className="flex h-[300px] items-center justify-center">
        <div>
          <p className="text-foreground">No accounts found.</p>
          <Button
            className="font-semibold text-md mt-3"
            onClick={() =>
              dispatch(setSelectedTab({ selectedTab: "Accounts" }))
            }
          >
            Get started by creating an account
          </Button>
        </div>
      </article>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((account) => (
          <div
            className="p-4 rounded-md shadow-lg bg-card border w-full"
            key={account.name}
          >
            <p className="font-semibold mb-2">{account.name}</p>

            <p className="text-md">Balance: {account.balance}₺</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountSummaries;
