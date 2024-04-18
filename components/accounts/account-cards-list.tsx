import AccountCard from "@/components/account-card";
import { AccountWithTransactions } from "@/server/types";

type AccountCardsListProps = {
  accounts: AccountWithTransactions[];
};

const AccountCardsList = ({ accounts }: AccountCardsListProps) => {
  return (
    <div className="max-h-[500px] pt-2 overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 pr-2">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};
export default AccountCardsList;
