"use client";
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
import { deleteAccount } from "@/actions/account";
import ActionPopover from "@/components/action-popover";
import { RxCross1, RxPencil2 } from "react-icons/rx";
import { GiTakeMyMoney } from "react-icons/gi";
import LatestAccountTransactionsDialog from "./latest-account-transactions-dialog";
import { useState } from "react";

interface IAccountCardProps {
  account: Account;
  className?: string;
  showPopover?: boolean;
}

const AccountCard = ({
  account,
  className,
  showPopover = true,
}: IAccountCardProps) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
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
      title: "Are you sure you want to delete this account?",
      message:
        "This will also delete all the transactions associated with this account. This action cannot be undone.",
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

  const handleShowLatestTransactions = () => {
    setSelectedAccount(account);
  };

  return (
    <>
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
        {showPopover && (
          <ActionPopover
            heading="Account Actions"
            options={[
              {
                icon: GiTakeMyMoney,
                label: "Show Latest Transactions",
                onClick: () => handleShowLatestTransactions(),
              },
              {
                icon: RxPencil2,
                label: "Edit",
                onClick: () => handleEditAccount(),
              },
              {
                icon: RxCross1,
                label: "Delete",
                onClick: () => handleDeleteAccount(account.id),
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
        <p className="text-md">Balance: {formatMoney(account.balance)}</p>
      </motion.div>
      <LatestAccountTransactionsDialog
        selectedAccount={selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </>
  );
};
export default AccountCard;
