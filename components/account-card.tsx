"use client";
import LatestAccountTransactionsDialog from "./latest-account-transactions-dialog";
import { useState } from "react";

import AccountCardContent from "./account-card-content";
import { AccountWithTransactions } from "@/actions/types";

interface IAccountCardProps {
  account: AccountWithTransactions;
  className?: string;
  showPopover?: boolean;
}

const AccountCard = ({ account }: IAccountCardProps) => {
  const [selectedAccount, setSelectedAccount] =
    useState<AccountWithTransactions | null>(null);

  return (
    <div>
      <AccountCardContent
        account={account}
        setSelectedAccount={setSelectedAccount}
        showPopover
      />
      <LatestAccountTransactionsDialog
        selectedAccount={selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </div>
  );
};
export default AccountCard;
