"use client";
import AccountCard from "../account-card";
import { motion } from "framer-motion";
import { Account } from "@prisma/client";

interface IAccountInformationProps {
  userAccounts: Account[];
}

const AccountInformation = ({ userAccounts }: IAccountInformationProps) => {
  return (
    <motion.div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
      {userAccounts && userAccounts?.length > 0 ? (
        userAccounts.map((userAccount) => (
          <AccountCard account={userAccount} key={userAccount.id} />
        ))
      ) : (
        <div className="my-4 w-full h-full">
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
