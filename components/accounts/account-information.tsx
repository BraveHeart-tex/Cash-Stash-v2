"use client";
import AccountCard from "@/components/account-card";
import type { AccountWithTransactions } from "@/typings/accounts";
import { motion } from "framer-motion";

type AccountInformationProps = {
  userAccounts: AccountWithTransactions[];
};

const AccountInformation = ({ userAccounts }: AccountInformationProps) => {
  return (
    <motion.div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
      {userAccounts && userAccounts?.length > 0 ? (
        userAccounts.map((userAccount) => (
          <AccountCard account={userAccount} key={userAccount.id} />
        ))
      ) : (
        <div className="my-4 h-full w-full">
          <h3 className="text-lg text-primary">No accounts found</h3>
          <p>
            You can remove existing filters to see all accounts or create a new
            one with this category.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AccountInformation;
