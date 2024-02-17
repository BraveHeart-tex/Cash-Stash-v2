import AccountCard from "./AccountCard";
import CreateAccountButton from "./CreateButtons/CreateAccountButton";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";
import MotionDiv from "@/components/animation/MotionDiv";
import { UserAccount } from "@prisma/client";
import Link from "next/link";
import { Button } from "./ui/button";

const AccountSummaries = ({ accounts }: { accounts: UserAccount[] }) => {
  if (accounts.length === 0) {
    return (
      <article className="flex h-[300px] items-center justify-center">
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
            <Link href="/accounts">See all your accounts</Link>
          </Button>
        </AnimatePresenceClient>
      </ul>
    </div>
  );
};

export default AccountSummaries;
