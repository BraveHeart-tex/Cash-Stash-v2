"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import { deleteAccount } from "@/actions/account";
import ActionPopover from "@/components/action-popover";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import { generateLabelFromEnumValue } from "@/lib/utils/stringUtils/generateLabelFromEnumValue";
import { AccountWithTransactions } from "@/actions/types";
import { FaTrash, FaEdit, FaRegCreditCard } from "react-icons/fa";

interface IAccountCardContentProps {
  account: AccountWithTransactions;
  className?: string;
  showPopover?: boolean;
  setSelectedAccount?: (
    // eslint-disable-next-line no-unused-vars
    account: AccountWithTransactions
  ) => void;
}

const AccountCardContent = ({
  account,
  setSelectedAccount,
  className,
  showPopover,
}: IAccountCardContentProps) => {
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

  return (
    <motion.div
      transition={{ duration: 0.5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layoutId={`account-card-${account.id}`}
      key={account.id}
      className={cn(
        "flex flex-col gap-2 p-4 border-1 shadow-xl rounded-md relative bg-card border cursor-pointer",
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
              label: "Edit",
              onClick: handleEditAccount,
            },
            {
              icon: FaTrash,
              label: "Delete",
              onClick: handleDeleteAccount,
            },
          ]}
          positionAbsolute
        />
      )}
      <p className="font-semibold mb-2 text-primary">
        {account.name}{" "}
        <span className="dark:text-white/60 text-foreground">
          ({accountCategory})
        </span>
      </p>
      <p>Balance: {formatMoney(account.balance)}</p>
    </motion.div>
  );
};
export default AccountCardContent;
