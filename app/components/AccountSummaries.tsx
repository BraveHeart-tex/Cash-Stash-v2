import { SerializedUserAccount } from "@/app/redux/features/userAccountSlice";
import AccountCard from "./AccountCard";
import CreateAccountButton from "./CreateButtons/CreateAccountButton";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";

const AccountSummaries = ({
  accounts,
}: {
  accounts: SerializedUserAccount[];
}) => {
  if (accounts.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div>
          <p className="text-primary">No accounts found.</p>
          <CreateAccountButton />
        </div>
      </article>
    );
  }

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4">
        <AnimatePresenceClient>
          {accounts.map((account) => (
            <AccountCard account={account} key={account.id} />
          ))}
        </AnimatePresenceClient>
      </ul>
    </div>
  );
};

export default AccountSummaries;
