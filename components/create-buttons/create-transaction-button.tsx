"use client";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { userCanCreateTransaction } from "@/server/transaction";
import { toast } from "sonner";

const CreateTransactionButton = ({ className }: { className?: string }) => {
  let [isPending, startTransition] = useTransition();
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const handleCreateTransactionClick = async () => {
    startTransition(async () => {
      const canCreateTransaction = await userCanCreateTransaction();

      if (!canCreateTransaction) {
        toast.error("No accounts found.", {
          description:
            "You need to create an account before you can create a transaction.",
        });
        return;
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
        "font-semibold mt-3 flex items-center gap-[14px] whitespace-nowrap",
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
          Create a transaction
        </>
      )}
    </Button>
  );
};
export default CreateTransactionButton;
