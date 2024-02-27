"use client";
import ActionPopover from "@/components/action-popover";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import {
  cn,
  formatMoney,
  generateReadableLabelFromEnumValue,
} from "@/lib/utils";
import { Account } from "@prisma/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import { deleteAccount } from "@/data/account";

interface IAccountCardProps {
  account: Account;
  className?: string;
}

const AccountCard = ({ account, className }: IAccountCardProps) => {
  const router = useRouter();
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );

  const accountCategory =
    generateReadableLabelFromEnumValue({ key: account.category }) + " Account";

  const handleDeleteAccount = (id: string) => {
    showGenericConfirm({
      title: "Delete Account",
      message: "Are you sure you want to delete this account?",
      primaryActionLabel: "Delete",
      async onConfirm() {
        const result = await deleteAccount(id);

        if (result?.error) {
          showErrorToast("An error occurred.", result.error);
        } else {
          router.refresh();
          showSuccessToast(
            "Account deleted.",
            "Selected account has been deleted."
          );
        }
      },
    });
  };

  return (
    <motion.div
      transition={{ duration: 0.5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layoutId={`account-card-${account.id}`}
      className={cn(
        "p-4 rounded-md shadow-lg border w-full cursor-pointer relative",
        className
      )}
    >
      <ActionPopover
        popoverHeading={"Account Actions"}
        onEditActionClick={() => {
          openGenericModal({
            mode: "edit",
            key: "account",
            data: account,
            dialogTitle: "Edit your account",
            dialogDescription: "Use the form below to edit your account.",
            entityId: account.id,
          });
        }}
        onDeleteActionClick={() => handleDeleteAccount(account.id)}
      />
      <p className="font-semibold mb-2 text-primary">
        {account.name}{" "}
        <span className="dark:text-white/60 text-foreground">
          ({accountCategory})
        </span>
      </p>
      <p className="text-md">Balance: {formatMoney(account.balance)}</p>
    </motion.div>
  );
};
export default AccountCard;
