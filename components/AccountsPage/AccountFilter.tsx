"use client";
import { useState } from "react";
import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import AccountInformation from "./AccountInformation";
import { SerializedUserAccount } from "@/app/redux/features/userAccountSlice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";

const AccountsFilter = ({
  accounts,
}: {
  accounts: SerializedUserAccount[];
}) => {
  const [selectedAccountType, setSelectedAccountType] = useState("");

  if (accounts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.5, type: "just" }}
        className="lg:text-center"
      >
        <h3 className="inline-block text-lg lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          You don&apos;t have any accounts yet.
        </h3>
        <p className="mt-3">
          Create one by clicking the Create Account button.
        </p>
      </motion.div>
    );
  }

  const filteredAccounts = accounts?.filter((account) =>
    selectedAccountType ? account.category === selectedAccountType : true
  );

  const handleAccountTypeChange = (value: string) => {
    setSelectedAccountType(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 ">
      <div className="flex justify-start mb-2 col-span-2 w-full">
        <Select
          defaultValue={
            selectedAccountType ? selectedAccountType : "All Accounts"
          }
          value={selectedAccountType}
          onValueChange={handleAccountTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Account Type</SelectLabel>
              <SelectItem value={""}>All Accounts</SelectItem>
              {Object.entries(CreateUserAccountOptions).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-10">
        <AccountInformation userAccounts={filteredAccounts} />
      </div>
    </div>
  );
};

export default AccountsFilter;
