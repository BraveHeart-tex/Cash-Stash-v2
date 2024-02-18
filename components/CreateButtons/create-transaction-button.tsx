"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { showErrorToast } from "@/components/ui/use-toast";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { openGenericModal } from "@/lib/genericModalUtils";
import { FaExchangeAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";

const CreateTransactionButton = () => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const handleCreateTransactionClick = async () => {
    startTransition(async () => {
      const result = await getGenericListByCurrentUser({
        tableName: "userAccount",
      });

      if (result?.error)
        return showErrorToast("An error occurred.", result?.error as string);

      if (!result) {
        return showErrorToast(
          "No accounts found.",
          "You need to create an account before you can create a transaction."
        );
      } else {
        openGenericModal("Transactions", dispatch, {
          userAccounts: result.data,
        });
      }
    });
  };

  return (
    <Button
      className={cn(
        "font-semibold text-md mt-3 flex items-center gap-[14px]",
        isPending && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleCreateTransactionClick}
      loading={isPending}
    >
      {isPending ? (
        "Loading..."
      ) : (
        <>
          <FaExchangeAlt className="text-xl" />
          Create Transaction
        </>
      )}
    </Button>
  );
};
export default CreateTransactionButton;
