"use client";
import AccountCardContent from "@/components/account-card-content";
import LatestAccountTransactionsDialog from "@/components/latest-account-transactions-dialog";
import type { AccountWithTransactions } from "@/typings/accounts";
import { useState } from "react";

type AccountCardProps = {
  account: AccountWithTransactions;
  className?: string;
  showPopover?: boolean;
};

const AccountCard = ({ account }: AccountCardProps) => {
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
