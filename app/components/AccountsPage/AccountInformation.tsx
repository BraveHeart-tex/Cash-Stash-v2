"use client";
import { SerializedUserAccount } from "@/app/redux/features/userAccountSlice";
import AccountCard from "../AccountCard";
import { AnimatePresence, motion } from "framer-motion";

interface IAccountInformationProps {
  userAccounts: SerializedUserAccount[] | undefined | null;
}

const AccountInformation = ({ userAccounts }: IAccountInformationProps) => {
  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <AnimatePresence>
        {userAccounts && userAccounts?.length > 0 ? (
          userAccounts.map((userAccount) => (
            <AccountCard account={userAccount} key={userAccount.id} />
          ))
        ) : (
          <div className="my-4">
            <h3 className="text-lg text-primary">No accounts found</h3>
            <p>
              You can remove existing filters to see all accounts or create a
              new one with this category.
            </p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountInformation;
