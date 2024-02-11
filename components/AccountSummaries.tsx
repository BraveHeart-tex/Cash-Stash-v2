import { SerializedUserAccount } from "@/app/redux/features/userAccountSlice";
import AccountCard from "./AccountCard";
import CreateAccountButton from "./CreateButtons/CreateAccountButton";
import AnimatePresenceClient from "@/components/animation/AnimatePresence";
import MotionDiv from "@/components/animation/MotionDiv";

const AccountSummaries = ({
  accounts,
}: {
  accounts: SerializedUserAccount[];
}) => {
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
        </AnimatePresenceClient>
      </ul>
    </div>
  );
};

export default AccountSummaries;
