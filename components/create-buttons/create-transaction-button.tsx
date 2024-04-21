"use client";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { FaExchangeAlt, FaPlus } from "react-icons/fa";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { userCanCreateTransaction } from "@/server/transaction";
import { toast } from "sonner";

type CreateTransactionButtonProps = {
  className?: string;
  minimizeOnMobile?: boolean;
};

const CreateTransactionButton = ({
  className,
  minimizeOnMobile,
}: CreateTransactionButtonProps) => {
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
        "font-semibold",
        isPending && "cursor-not-allowed opacity-50",
        className
      )}
      type="button"
      name="create-transaction"
      aria-label="Create a transaction"
      onClick={handleCreateTransactionClick}
      loading={isPending}
    >
      <FaPlus
        className={cn("hidden text-xl", minimizeOnMobile && "inline md:hidden")}
      />
      <div
        className={cn(
          "flex items-center gap-[14px] whitespace-nowrap",
          minimizeOnMobile && "hidden md:flex"
        )}
      >
        {isPending ? (
          "Loading..."
        ) : (
          <>
            <FaExchangeAlt className="text-xl" />
            Create a transaction
          </>
        )}
      </div>
    </Button>
  );
};
export default CreateTransactionButton;
