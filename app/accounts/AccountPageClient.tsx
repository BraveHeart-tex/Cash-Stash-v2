"use client";
import AccountsFilter from "@/app/components/AccountsPage/AccountFilter";
import { useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { openGenericModal } from "../redux/features/genericModalSlice";

export default function AccountsPageClient() {
  const dispatch = useAppDispatch();

  return (
    <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <h3 className="text-4xl mb-4 text-primary">Accounts</h3>
      <div className="flex justify-center items-center flex-col gap-4">
        <div className="w-full">
          <AccountsFilter />
        </div>
        <Button
          className="mt-4 font-semibold self-start"
          onClick={() =>
            dispatch(
              openGenericModal({
                mode: "create",
                key: "account",
                dialogTitle: "Create an account",
                dialogDescription:
                  "Fill out the form below to create an account.",
                entityId: 0,
              })
            )
          }
        >
          Create Account
        </Button>
      </div>
    </div>
  );
}
