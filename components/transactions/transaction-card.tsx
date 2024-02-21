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
import { showGenericConfirm } from "@/redux/features/genericConfirmSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteTransactionById } from "@/actions/transaction";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Transaction } from "@prisma/client";
import { openGenericModal } from "@/redux/features/genericModalSlice";
import DataLabel from "../data-label";

interface ITransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: ITransactionCardProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleDeleteCallback = (
    result: Awaited<ReturnType<typeof deleteTransactionById>>,
    cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
  ) => {
    if (result?.error) {
      showErrorToast("An error occurred.", result.error as string);
    } else {
      router.refresh();
      showSuccessToast(
        "Transaction deleted.",
        "Selected transaction has been deleted."
      );
      dispatch(cleanUp());
    }
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
        onDeleteActionClick={() => {
          dispatch(
            showGenericConfirm({
              title: "Delete Transaction",
              message: "Are you sure you want to delete this transaction?",
              primaryActionLabel: "Delete",
              primaryAction: async () => deleteTransactionById(transaction.id),
              resolveCallback: handleDeleteCallback,
            })
          );
        }}
        placementClasses={"mb-0 top-4 right-0"}
        isAbsolute={true}
      />
    </motion.div>
  );
};

export default TransactionCard;
