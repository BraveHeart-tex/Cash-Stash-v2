"use client";
import LatestAccountTransactionsDialog from "./latest-account-transactions-dialog";
import { useState } from "react";

import AccountCardContent from "./account-card-content";
import { AccountWithTransactions } from "@/server/types";

interface IAccountCardProps {
  account: AccountWithTransactions;
  className?: string;
  showPopover?: boolean;
}

const AccountCard = ({ account }: IAccountCardProps) => {
  const [selectedAccount, setSelectedAccount] =
    useState<AccountWithTransactions | null>(null);

  return (
    <article>
      <AccountCardContent
        account={account}
        setSelectedAccount={setSelectedAccount}
        showPopover
      />
      <LatestAccountTransactionsDialog
        selectedAccount={selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </article>
  );
};
export default AccountCard;
