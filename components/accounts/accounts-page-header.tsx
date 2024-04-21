import CreateAccountButton from "@/components/create-buttons/create-account-button";

const AccountsPageHeader = () => {
  return (
    <header className="flex items-center justify-between mb-4">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        Accounts
      </h1>
      <CreateAccountButton minimizeOnMobile className="self-start" />
    </header>
  );
};

export default AccountsPageHeader;
