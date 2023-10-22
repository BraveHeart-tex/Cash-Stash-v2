"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchCurrentUserAccounts } from "@/app/redux/features/userAccountSlice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { setSelectedTab } from "../redux/features/navigationTabsSlice";
import { FaPiggyBank } from "react-icons/fa";
import AccountCard from "./AccountCard";
import { openGenericModal } from "@/lib/genericModalUtils";

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
          <p className="text-primary">No accounts found.</p>
          <Button
            className="font-semibold text-md mt-3 flex items-center gap-[14px]"
            onClick={() => openGenericModal("Accounts", dispatch)}
          >
            <FaPiggyBank size={18} /> Create an account
          </Button>
        </div>
      </article>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((account) => (
          <AccountCard account={account} key={account.id} />
        ))}
      </div>
    </div>
  );
};

export default AccountSummaries;
