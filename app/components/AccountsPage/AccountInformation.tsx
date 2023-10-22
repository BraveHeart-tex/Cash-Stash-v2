"use client";
import { SerializedUserAccount } from "@/app/redux/features/userAccountSlice";
import AccountCard from "../AccountCard";

interface IAccountInformationProps {
  userAccounts: SerializedUserAccount[] | undefined | null;
}

const AccountInformation = ({ userAccounts }: IAccountInformationProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {userAccounts && userAccounts?.length > 0 ? (
        userAccounts.map((userAccount) => (
          <AccountCard key={userAccount.id} account={userAccount} />
        ))
      ) : (
        <div className="my-4">
          <h3 className="text-lg text-primary">No accounts found</h3>
          <p>
            You can remove existing filters to see all accounts or create a new
            one with this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountInformation;
