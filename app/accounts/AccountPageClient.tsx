"use client";
import Navigation from "@/app/components/Navigation";
import CreateUserAccountModal from "@/app/components/AccountsPage/modals/CreateUserAccountModal";
import AccountsFilter from "@/app/components/AccountsPage/AccountFilter";
import { useAppDispatch } from "@/app/redux/hooks";
import { setIsCreateAccountModalOpen } from "@/app/redux/features/userAccountSlice";
import { Button } from "@/components/ui/button";

export default function AccountsPageClient() {
  const dispatch = useAppDispatch();

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <Navigation />
      <h3 className="text-4xl mb-4 text-primary">Accounts</h3>
      <div className="flex justify-center items-center flex-col gap-4">
        <div className="w-full">
          <AccountsFilter />
        </div>
        <Button
          className="mt-4 font-semibold self-start"
          onClick={() => dispatch(setIsCreateAccountModalOpen(true))}
        >
          Create Account
        </Button>
        <CreateUserAccountModal />
      </div>
    </div>
  );
}
