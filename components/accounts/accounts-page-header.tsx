import CreateAccountButton from "@/components/create-buttons/create-account-button";

const AccountsPageHeader = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        Accounts
      </h1>
      <CreateAccountButton className="self-start mt-0" />
    </div>
  );
};

export default AccountsPageHeader;
