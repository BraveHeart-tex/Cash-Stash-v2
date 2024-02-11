"use client";
import { useState } from "react";
import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import AccountInformation from "./AccountInformation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { UserAccount } from "@prisma/client";
import GenericNotFound from "../NotFound";

const AccountsFilter = ({
  accounts,
  pageHasParams,
}: {
  accounts: UserAccount[];
  pageHasParams: boolean;
}) => {
  const [selectedAccountType, setSelectedAccountType] = useState("");

  if (accounts.length === 0) {
    return (
      <GenericNotFound
        renderTitle={({ className }) => (
          <h3 className={className}>
            {pageHasParams
              ? "No accounts found for your search"
              : "You don't have any accounts yet."}
          </h3>
        )}
        renderMessage={({ className }) => (
          <p className={className}>
            {pageHasParams && "Remove existing filters or "}
            create an account by clicking the "Create an Account" button.
          </p>
        )}
      />
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
      <div className="col-span-10 h-[500px] overflow-auto">
        <AccountInformation userAccounts={filteredAccounts} />
      </div>
    </div>
  );
};

export default AccountsFilter;
