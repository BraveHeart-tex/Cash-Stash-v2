"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteTransactionById } from "@/server/transaction";
import { useRouter } from "next/navigation";
import { HTMLMotionProps, motion } from "framer-motion";
import DataLabel from "@/components/data-label";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import ActionPopover from "@/components/action-popover";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import { FaEdit, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import useAuthStore from "@/store/auth/authStore";
import { TransactionWithCategoryAndAccountName } from "@/server/types";

type TransactionCardProps = {
  transaction: TransactionWithCategoryAndAccountName;
  showPopover?: boolean;
  useLayoutId?: boolean;
};

const TransactionCard = ({
  transaction,
  showPopover = true,
  useLayoutId = true,
}: TransactionCardProps) => {
  const preferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency
  );
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const router = useRouter();

  const handleDeleteClick = () => {
    showGenericConfirm({
      title: "Are you sure you want to delete this transaction?",
      message: "This action cannot be undone.",
      primaryActionLabel: "Delete",
      onConfirm: async () => {
        const response = await deleteTransactionById(transaction);
        if (response?.error) {
          toast.error("An error occurred.", {
            description: response.error,
          });
        } else {
          router.refresh();
          toast.success("Transaction deleted.", {
            description: "Selected transaction has been deleted.",
          });
        }
      },
    });
  };

  const isIncome = transaction.amount > 0;

  const handleEditClick = () => {
    openGenericModal({
      dialogTitle: "Edit Transaction",
      dialogDescription:
        "Edit the transaction information by using the form below.",
      entityId: transaction.id,
      mode: "edit",
      key: "transaction",
      data: transaction,
    });
  };

  const formatTransactionDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm");
  };

  const motionConfig: HTMLMotionProps<"article"> = {
    transition: { duration: 0.8 },
  };

  if (useLayoutId) {
    motionConfig.layoutId = `transaction-card-${transaction.id}`;
  }

  return (
    <motion.article {...motionConfig} className="relative">
      <Card className={"relative mt-4"}>
        <CardHeader className={"h-[100px] border-b"}>
          <CardTitle>{transaction.description}</CardTitle>
          <CardDescription>{transaction.category}</CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          <div className="grid grid-cols-1 gap-1">
            <DataLabel
              label="Date"
              value={formatTransactionDate(transaction.createdAt)}
            />
            <DataLabel label={"Category"} value={transaction.category} />
            <DataLabel label={"Account Name"} value={transaction.accountName} />

            <DataLabel
              label="Amount"
              value={formatMoney(transaction.amount, preferredCurrency)}
              classNames={{
                value: cn(
                  "font-semibold",
                  isIncome ? "text-success" : "text-destructive"
                ),
              }}
            />
          </div>
        </CardContent>
      </Card>
      {showPopover && (
        <ActionPopover
          heading="Transaction Actions"
          options={[
            {
              icon: FaEdit,
              label: "Edit",
              onClick: () => handleEditClick(),
            },
            {
              icon: FaTrash,
              label: "Delete",
              onClick: () => handleDeleteClick(),
            },
          ]}
          positionAbsolute
          triggerClassName="mb-0 top-4 right-0"
        />
      )}
    </motion.article>
  );
};

export default TransactionCard;
