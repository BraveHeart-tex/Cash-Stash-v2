import AccountCard from "@/components/account-card";
import CreateAccountButton from "@/components/create-buttons/create-account-button";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/lib/constants";
import { AccountWithTransactions } from "@/server/types";

const AccountSummaries = ({
  accounts,
}: {
  accounts: AccountWithTransactions[];
}) => {
  if (accounts.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-primary">No accounts found.</p>
          <CreateAccountButton />
        </div>
      </article>
    );
  }

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 pr-2">
        <AnimatePresenceClient>
          {accounts.map((account, index) => (
            <AccountCard account={account} key={account.id + index} />
          ))}
          <Button className="ml-auto mt-2 w-max">
            <Link href={PAGE_ROUTES.ACCOUNTS_ROUTE}>See all your accounts</Link>
          </Button>
        </AnimatePresenceClient>
      </ul>
    </div>
  );
};

export default AccountSummaries;
