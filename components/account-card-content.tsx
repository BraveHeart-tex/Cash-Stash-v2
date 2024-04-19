"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import { deleteAccount } from "@/server/account";
import ActionPopover from "@/components/action-popover";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import { generateLabelFromEnumValue } from "@/lib/utils/stringUtils/generateLabelFromEnumValue";
import { AccountWithTransactions } from "@/server/types";
import {
  FaTrash,
  FaEdit,
  FaRegCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import useAuthStore from "@/store/auth/authStore";

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
      title: "Are you sure you want to delete this account?",
      message:
        "This will also delete all the transactions associated with this account. This action cannot be undone.",
      primaryActionLabel: "Delete",
      async onConfirm() {
        const result = await deleteAccount(account.id);

        if (result?.error) {
          toast.error("An error occurred.", {
            description: result.error,
          });
        } else {
          router.refresh();
          toast.success("Account deleted.", {
            description: "Selected account has been deleted.",
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
      dialogTitle: "Edit your account",
      dialogDescription: "Use the form below to edit your account.",
      entityId: account.id,
    });
  };

  const accountCategory =
    generateLabelFromEnumValue(account.category) + " Account";

  const handleCreateTransactionClick = () => {
    openGenericModal({
      dialogTitle: "Create Transaction",
      dialogDescription: "Use the form below to create a new transaction.",
      mode: "create",
      key: "transaction",
      data: {
        accountId: account.id,
      },
    });
  };

  return (
    <motion.div
      transition={{ duration: 0.5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layoutId={`account-card-${account.id}`}
      key={account.id}
      className={cn(
        "flex flex-col gap-2 p-4 shadow-sm border-1 rounded-md relative bg-card border",
        className
      )}
    >
      {showPopover && (
        <ActionPopover
          heading="Account Actions"
          options={[
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
          ]}
          positionAbsolute
          triggerClassName="top-0 right-0"
        />
      )}
      <p className="font-semibold mb-2 text-primary">
        {account.name}{" "}
        <span className="text-foreground">({accountCategory})</span>
      </p>
      <p>Balance: {formatMoney(account.balance, preferredCurrency)}</p>
    </motion.div>
  );
};
export default AccountCardContent;
