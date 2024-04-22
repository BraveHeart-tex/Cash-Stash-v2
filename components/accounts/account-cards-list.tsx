import AccountCard from "@/components/account-card";
import { AccountWithTransactions } from "@/server/types";

type AccountCardsListProps = {
  accounts: AccountWithTransactions[];
};

const AccountCardsList = ({ accounts }: AccountCardsListProps) => {
  return (
    <div className="mt-2 h-[calc(100vh-450px)] overflow-auto lg:h-[calc(100vh-500px)]">
      <div className="grid grid-cols-1 gap-4 pb-4 pr-2 lg:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};
export default AccountCardsList;
