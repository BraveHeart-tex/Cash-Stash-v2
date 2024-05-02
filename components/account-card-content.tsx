"use client";
import { useRouter } from "@/navigation";
import { motion } from "framer-motion";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import { deleteAccount } from "@/server/account";
import ActionPopover, {
  PopoverActionOption,
} from "@/components/action-popover";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import {
  FaTrash,
  FaEdit,
  FaRegCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import useAuthStore from "@/store/auth/authStore";
import { AccountWithTransactions } from "@/typings/accounts";
import { useTranslations } from "next-intl";

type AccountCardContentProps = {
  account: AccountWithTransactions;
  className?: string;
  showPopover?: boolean;
  setSelectedAccount?: (
    // eslint-disable-next-line no-unused-vars
    account: AccountWithTransactions
  ) => void;
};

const AccountCardContent = ({
  account,
  setSelectedAccount,
  className,
  showPopover,
}: AccountCardContentProps) => {
  const categoryT = useTranslations("Enums.AccountCategory");
  const t = useTranslations("Components.AccountCard");
  const preferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency
  );
  const router = useRouter();
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );

  const handleDeleteAccount = () => {
    showGenericConfirm({
      title: t("deleteAccountDialogTitle"),
      message: t("deleteAccountDialogMessage"),
      primaryActionLabel: t("deleteAccountDialogPrimaryActionLabel"),
      async onConfirm() {
        const result = await deleteAccount(account.id);

        if (result?.error) {
          toast.error(t("deleteAccountErrorMessage"), {
            description: result.error,
          });
        } else {
          router.refresh();
          toast.success(t("deleteAccountSuccessMessage"), {
            description: t("deleteAccountSuccessDescription"),
          });
        }
      },
    });
  };

  const handleEditAccount = () => {
    openGenericModal({
      mode: "edit",
      key: "account",
      data: account,
      dialogTitle: t("editAccountDialogTitle"),
      dialogDescription: t("editAccountAccountDialogMessage"),
      entityId: account.id,
    });
  };

  const accountCategory = categoryT(account.category);

  const handleCreateTransactionClick = () => {
    openGenericModal({
      dialogTitle: t("createTransactionDialogTitle"),
      dialogDescription: t("createTransactionAccountDialogMessage"),
      mode: "create",
      key: "transaction",
      data: {
        accountId: account.id,
      },
    });
  };

  const popoverActions: PopoverActionOption[] = [
    {
      icon: FaRegCreditCard,
      label: "Show Latest Transactions",
      onClick: () => setSelectedAccount?.(account),
      visible: account.transactions.length > 0,
    },
    {
      icon: FaEdit,
      label: "Edit Account",
      onClick: handleEditAccount,
    },
    {
      icon: FaMoneyBillWave,
      label: "Add Transaction",
      onClick: handleCreateTransactionClick,
    },
    {
      icon: FaTrash,
      label: "Delete",
      onClick: handleDeleteAccount,
    },
  ];

  return (
    <motion.div
      transition={{ duration: 0.5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layoutId={`account-card-${account.id}`}
      key={account.id}
      className={cn(
        "border-1 relative flex flex-col gap-2 rounded-md border bg-card p-4 shadow-sm",
        className
      )}
    >
      {showPopover && (
        <ActionPopover
          heading={t("accountActionsHeading")}
          options={popoverActions.map((item) => ({
            ...item,
            label: t(item.label as any),
          }))}
          positionAbsolute
          triggerClassName="top-0 right-0"
        />
      )}
      <p className="mb-2 font-semibold text-primary">
        {account.name}{" "}
        <span className="text-foreground">({accountCategory})</span>
      </p>
      <p>Balance: {formatMoney(account.balance, preferredCurrency)}</p>
    </motion.div>
  );
};
export default AccountCardContent;
