"use client";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { showErrorToast } from "@/components/ui/use-toast";
import { FaExchangeAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import useGenericModalStore from "@/store/genericModalStore";
import { getPaginatedAccounts } from "@/actions/account";

const CreateTransactionButton = ({ className }: { className?: string }) => {
  let [isPending, startTransition] = useTransition();
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const handleCreateTransactionClick = async () => {
    startTransition(async () => {
      const response = await getPaginatedAccounts({
        pageNumber: 1,
      });

      if (response.accounts.length === 0) {
        return showErrorToast(
          "No accounts found.",
          "You need to create an account before you can create a transaction."
        );
      } else {
        openGenericModal({
          dialogTitle: "Create Transaction",
          dialogDescription: "Use the form below to create a new transaction.",
          mode: "create",
          key: "transaction",
        });
      }
    });
  };

  return (
    <Button
      className={cn(
        "font-semibold text-md mt-3 flex items-center gap-[14px]",
        isPending && "opacity-50 cursor-not-allowed",
        className
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
