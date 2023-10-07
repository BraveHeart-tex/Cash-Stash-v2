"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  fetchTransactions,
  SerializedTransaction,
} from "@/app/redux/features/transactionsSlice";
import { fetchCurrentUserAccounts } from "@/app/redux/features/userAccountSlice";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ActionPopover from "@/components/ActionPopover";
import {
  showErrorToast,
  showSuccessToast,
  useToast,
} from "@/components/ui/use-toast";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteTransactionByIdAction } from "@/actions";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
interface ITransactionCardProps {
  transaction: SerializedTransaction;
}

const TransactionCard = ({ transaction }: ITransactionCardProps) => {
  const { currentUserAccounts, isLoading } = useAppSelector(
    (state) => state.userAccountReducer
  );
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
  }, [dispatch]);

  if (isLoading) {
    return <Skeleton className={"h-[11.25rem]"} />;
  }

  const handleDeleteCallback = (
    result: Awaited<ReturnType<typeof deleteTransactionByIdAction>>,
    cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
  ) => {
    if (result?.error) {
      showErrorToast("An error occurred.", result.error);
    } else {
      showSuccessToast(
        "Transaction deleted.",
        "Selected transaction has been deleted."
      );
      dispatch(fetchTransactions());
      dispatch(cleanUp());
    }
  };

  return (
    <Card className={"mt-4"}>
      <CardHeader className={"flex items-center flex-row justify-between pt-1"}>
        <CardTitle>
          {transaction.description || "No description provided."}
        </CardTitle>
        <div className={"flex flex-row items-center gap-1"}>
          <Badge
            className={cn(transaction.isIncome ? "bg-green-500" : "bg-red-500")}
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
                  message: "Are you sure you want to delete this transaction?",
                  primaryActionLabel: "Delete",
                  primaryAction: async () =>
                    deleteTransactionByIdAction(transaction.id),
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
            <p className={"font-semibold"}>Transaction Date: </p>
            <p>{transaction.createdAt}</p>
          </div>
          <div className={"flex items-center gap-1"}>
            <p className={"font-semibold"}>Account Name: </p>
            <p>
              {currentUserAccounts &&
                currentUserAccounts.find(
                  (account) => account.id === transaction.accountId
                )?.name}
            </p>
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
  );
};

export default TransactionCard;
