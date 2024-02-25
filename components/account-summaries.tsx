import AccountCard from "./account-card";
import CreateAccountButton from "./create-buttons/create-account-button";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import MotionDiv from "@/components/animations/motion-div";
import { Account } from "@prisma/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { PAGE_ROUTES } from "@/lib/constants";

const AccountSummaries = ({ accounts }: { accounts: Account[] }) => {
  if (accounts.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary">No accounts found.</p>
          <CreateAccountButton />
        </MotionDiv>
      </article>
    );
  }

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4">
        <AnimatePresenceClient>
          {accounts.map((account, index) => (
            <AccountCard account={account} key={account.id + index} />
          ))}
          <Button className="w-max mt-2 ml-auto">
            <Link href={PAGE_ROUTES.ACCOUNTS_ROUTE}>See all your accounts</Link>
          </Button>
        </AnimatePresenceClient>
      </ul>
    </div>
  );
};

export default AccountSummaries;
