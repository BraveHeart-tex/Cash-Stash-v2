"use client";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { FaExchangeAlt, FaPlus } from "react-icons/fa";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { canUserCreateTransaction } from "@/server/transaction";
import { toast } from "sonner";
import { AccountSelectModel } from "@/lib/database/schema";
import { useTranslations } from "next-intl";

type CreateTransactionButtonProps = {
  className?: string;
  minimizeOnMobile?: boolean;
};

const CreateTransactionButton = ({
  className,
  minimizeOnMobile,
}: CreateTransactionButtonProps) => {
  const t = useTranslations("Components.CreateTransactionButton");
  const createAccountT = useTranslations("Components.CreateAccountButton");
  let [isPending, startTransition] = useTransition();
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );

  const openCreateTransactionModal = (accountId?: number) => {
    openGenericModal({
      dialogTitle: t("label"),
      dialogDescription: t("createTransactionDialogMessage"),
      mode: "create",
      key: "transaction",
      data: {
        accountId,
      },
    });
  };

  const openCreateAccountModal = () => {
    openGenericModal({
      key: "account",
      mode: "create",
      dialogTitle: createAccountT("createAccountDialogTitle"),
      dialogDescription: createAccountT("createAccountDialogMessage"),
      props: {
        afterSave: (values: AccountSelectModel) => {
          setTimeout(() => {
            openCreateTransactionModal(values.id);
          }, 300);
        },
      },
    });
  };

  const handleCreateTransactionClick = async () => {
    startTransition(async () => {
      const canCreateTransaction = await canUserCreateTransaction();

      if (!canCreateTransaction) {
        toast.error(t("noAccountsFound"), {
          description: t("noAccountsFoundDescription"),
          action: {
            label: createAccountT("label"),
            onClick: () => {
              openCreateAccountModal();
            },
          },
        });
      } else {
        openCreateTransactionModal();
      }
    });
  };

  const buttonLabel = t("label");

  return (
    <Button
      className={cn(
        "font-semibold",
        isPending && "cursor-not-allowed opacity-50",
        className
      )}
      type="button"
      name="create-transaction"
      aria-label={buttonLabel}
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
        <FaExchangeAlt className="text-xl" />
        {buttonLabel}
      </div>
    </Button>
  );
};
export default CreateTransactionButton;
