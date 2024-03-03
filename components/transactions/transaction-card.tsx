"use client";
import {
  cn,
  formatMoney,
  formatTransactionDate,
  generateReadableLabelFromEnumValue,
} from "@/lib/utils";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteTransactionById } from "@/data/transaction";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DataLabel from "@/components/data-label";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import { TransactionResponse, TransactionWithAccount } from "@/data/types";
import ActionPopover from "@/components/action-popover";
import { RxCross1, RxPencil2 } from "react-icons/rx";
import { Transaction } from "@prisma/client";

interface ITransactionCardProps {
  transaction: TransactionResponse;
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
          showErrorToast("An error occurred.", response.error);
        } else {
          router.refresh();
          showSuccessToast(
            "Transaction deleted.",
            "Selected transaction has been deleted."
          );
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
          <CardDescription>
            {generateReadableLabelFromEnumValue({ key: transaction.category })}
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          <div className="grid grid-cols-1 gap-1">
            <DataLabel
              label="Date"
              value={formatTransactionDate(transaction.createdAt)}
            />
            <DataLabel
              label={"Category"}
              value={generateReadableLabelFromEnumValue({
                key: transaction.category,
              })}
            />
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
            icon: RxPencil2,
            label: "Edit",
            onClick: () => handleEditClick(),
          },
          {
            icon: RxCross1,
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
