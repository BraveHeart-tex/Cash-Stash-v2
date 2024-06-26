"use client";
import LatestAccountTransactionsDialog from "@/components/latest-account-transactions-dialog";
import { useState } from "react";
import AccountCardContent from "@/components/account-card-content";
import { AccountWithTransactions } from "@/typings/accounts";

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
