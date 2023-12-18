import AccountsPage from "./AccountPageClient";

const AccountPage = async () => {
  return (
    <main>
      {/* @ts-expect-error React Server Component */}
      <AccountsPage />
    </main>
  );
};

export default AccountPage;
