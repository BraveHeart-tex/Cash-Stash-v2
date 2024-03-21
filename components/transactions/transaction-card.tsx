"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteTransactionById } from "@/actions/transaction";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DataLabel from "@/components/data-label";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import ActionPopover from "@/components/action-popover";
import { toast } from "sonner";
import { TransactionSelectModel } from "@/lib/database/schema";
import { format } from "date-fns";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import { generateLabelFromEnumValue } from "@/lib/utils/stringUtils/generateLabelFromEnumValue";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ITransactionCardProps {
  transaction: TransactionSelectModel & { accountName: string };
}

const TransactionCard = ({ transaction }: ITransactionCardProps) => {
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const router = useRouter();

  const handleDeleteClick = () => {
    showGenericConfirm({
      title: "Delete Transaction",
      message: "Are you sure you want to delete this transaction?",
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

  const transactionCategoryLabel = generateLabelFromEnumValue(
    transaction.category
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative"
      layoutId={`transaction-card-${transaction.id}`}
    >
      <Card className={"mt-4 cursor-pointer relative"}>
        <CardHeader className={"border-b h-[100px]"}>
          <CardTitle>{transaction.description}</CardTitle>
          <CardDescription>{transactionCategoryLabel}</CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          <div className="grid grid-cols-1 gap-1">
            <DataLabel
              label="Date"
              value={formatTransactionDate(transaction.createdAt)}
            />
            <DataLabel label={"Category"} value={transactionCategoryLabel} />
            <DataLabel label={"Account Name"} value={transaction.accountName} />

            <DataLabel
              label="Amount"
              value={formatMoney(transaction.amount)}
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
    </motion.div>
  );
};

export default TransactionCard;
