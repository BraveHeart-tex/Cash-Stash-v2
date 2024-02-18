"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import { SerializedTransaction } from "@/app/redux/features/transactionsSlice";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ActionPopover from "@/components/action-popover";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteTransactionById } from "@/actions";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ITransactionCardProps {
  transaction: SerializedTransaction;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 20 }}
      layoutId={`transaction-card-${transaction.id}`}
    >
      <Card className={"mt-4 cursor-pointer"}>
        <CardHeader
          className={"flex items-center flex-row justify-between pt-1"}
        >
          <CardTitle>
            {transaction.description || "No description provided."}
          </CardTitle>
          <div className={"flex flex-row items-center gap-1"}>
            <Badge
              className={cn(
                transaction.isIncome
                  ? "bg-success dark:bg-green-700"
                  : "bg-destructive"
              )}
            >
              {transaction.isIncome ? "Income" : "Expense"}
            </Badge>
            <ActionPopover
              popoverHeading={"Transaction Actions"}
              onEditActionClick={() => {
                showErrorToast(
                  "Error",
                  "You cannot edit transactions at this time."
                );
              }}
              onDeleteActionClick={() => {
                dispatch(
                  showGenericConfirm({
                    title: "Delete Transaction",
                    message:
                      "Are you sure you want to delete this transaction?",
                    primaryActionLabel: "Delete",
                    primaryAction: async () =>
                      deleteTransactionById(transaction.id),
                    resolveCallback: handleDeleteCallback,
                  })
                );
              }}
              placementClasses={"mb-0"}
              isAbsolute={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-1">
            <div className={"flex items-center gap-1"}>
              <p className={"font-semibold"}>Date: </p>
              <p>{transaction.createdAt}</p>
            </div>
            <div className={"flex items-center gap-1"}>
              <p className={"font-semibold"}>Account Name: </p>
              <p>{transaction.account && transaction?.account.name}</p>
            </div>
            <div className={"flex items-center gap-1"}>
              <p className={"font-semibold"}>Amount: </p>
              <p
                className={cn(
                  transaction.isIncome ? "text-green-500" : "text-red-500"
                )}
              >
                {transaction.isIncome ? "+" : "-"}${transaction.amount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionCard;
