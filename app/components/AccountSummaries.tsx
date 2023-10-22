import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchCurrentUserAccounts } from "@/app/redux/features/userAccountSlice";
import { Skeleton } from "@/components/ui/skeleton";
import AccountCard from "./AccountCard";
import CreateAccountButton from "./CreateButtons/CreateAccountButton";

const AccountSummaries = () => {
  const dispatch = useAppDispatch();
  const { currentUserAccounts: accounts, isLoading } = useAppSelector(
    (state) => state.userAccountReducer
  );

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-[300px] lg:h-[350px]" />
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
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
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((account) => (
          <AccountCard account={account} key={account.id} />
        ))}
      </div>
    </div>
  );
};

export default AccountSummaries;
