"use client";
import LatestAccountTransactionsDialog from "./latest-account-transactions-dialog";
import { useState } from "react";
import { AccountSelectModel } from "@/lib/database/schema";
import AccountCardContent from "./account-card-content";

interface IAccountCardProps {
  account: AccountSelectModel;
  className?: string;
  showPopover?: boolean;
}

const AccountCard = ({ account }: IAccountCardProps) => {
  const [selectedAccount, setSelectedAccount] =
    useState<AccountSelectModel | null>(null);

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
