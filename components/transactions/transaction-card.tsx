"use client";
import { useAppDispatch } from "@/redux/hooks";
import {
  cn,
  formatMoney,
  formatTransactionDate,
  generateReadbleEnumValue,
} from "@/lib/utils";
import ActionPopover from "@/components/action-popover";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
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
import { Transaction } from "@prisma/client";
import { openGenericModal } from "@/redux/features/genericModalSlice";
import DataLabel from "../data-label";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";

interface ITransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: ITransactionCardProps) => {
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );
  const router = useRouter();
  const dispatch = useAppDispatch();

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
            {generateReadbleEnumValue({ key: transaction.category })}
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
              value={generateReadbleEnumValue({ key: transaction.category })}
            />
            {/* TODO: */}
            <DataLabel label={"Account Name"} value={""} />

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
        popoverHeading={"Transaction Actions"}
        onEditActionClick={() => {
          dispatch(
            openGenericModal({
              dialogTitle: "Edit Transaction",
              dialogDescription:
                "Edit the transaction information by using the form below.",
              entityId: transaction.id,
              mode: "edit",
              key: "transaction",
              data: transaction,
            })
          );
        }}
        onDeleteActionClick={() => handleDeleteClick()}
        placementClasses={"mb-0 top-4 right-0"}
        isAbsolute={true}
      />
    </motion.div>
  );
};

export default TransactionCard;
