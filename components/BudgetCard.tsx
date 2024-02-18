"use client";
import { Progress } from "@/components/ui/progress";
import ActionPopover from "@/components/ActionPopover";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "../app/redux/hooks";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { openGenericModal } from "../app/redux/features/genericModalSlice";
import { showGenericConfirm } from "../app/redux/features/genericConfirmSlice";
import { cn, formatMoney } from "@/lib/utils";
import CreateBudgetOptions from "@/lib/CreateBudgetOptions";
import { deleteGeneric } from "@/actions/generic";
import { Budget } from "@prisma/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface IBudgetCardProps {
  budget: Budget;
}

const BudgetCard = ({ budget }: IBudgetCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleActionCallback = (
    result: Awaited<ReturnType<typeof deleteGeneric>>,
    cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
  ) => {
    if (result?.error) {
      showErrorToast("An error occurred.", result.error as string);
    } else {
      router.refresh();
      showSuccessToast("Budget deleted.", "Selected budget has been deleted.");
      dispatch(cleanUp());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      layoutId={`budget-card-${budget.id}`}
      key={budget.id}
      className="flex flex-col gap-2 p-4 pt-6 border-1 shadow-xl rounded-md relative bg-card border cursor-pointer"
    >
      <div className="flex flex-col gap-1 p-0">
        <span className="font-semibold text-foreground text-lg">
          {budget.name}
        </span>
        <span className="text-muted-foreground">
          {CreateBudgetOptions[budget.category]}
        </span>
      </div>
      <div className="absolute top-5 right-1 mb-2">
        <div className="flex items-center gap-1">
          <ActionPopover
            popoverHeading={"Budget Actions"}
            onEditActionClick={() =>
              dispatch(
                openGenericModal({
                  dialogTitle: "Edit Budget",
                  dialogDescription:
                    "Edit your budget information by using the form below.",
                  entityId: budget.id,
                  mode: "edit",
                  key: "budget",
                })
              )
            }
            onDeleteActionClick={() =>
              dispatch(
                showGenericConfirm({
                  title: "Delete Budget",
                  message: "Are you sure you want to delete this budget?",
                  primaryActionLabel: "Delete",
                  primaryAction: async () =>
                    await deleteGeneric<Budget>({
                      tableName: "budget",
                      whereCondition: { id: budget.id },
                    }),
                  resolveCallback: handleActionCallback,
                })
              )
            }
            isAbsolute={false}
            placementClasses="top-0 right-0 mb-0"
          />
          <Badge
            className={cn(
              "select-none cursor-pointer",
              budget.spentAmount / budget.budgetAmount > 0.5
                ? "bg-destructive hover:bg-destructive"
                : "bg-success hover:bg-success"
            )}
          >
            {((budget.spentAmount / budget.budgetAmount) * 100).toFixed(0)}%
          </Badge>
        </div>
      </div>
      <Progress
        value={budget.progress}
        className="mt-4"
        indicatorClassName={cn(
          budget.progress > 50
            ? "bg-destructive"
            : budget.progress > 25
              ? "bg-orange-500"
              : "bg-success"
        )}
      />
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between mt-2">
        <span className="dark:text-white/60 text-foreground">
          Budget: {formatMoney(budget.budgetAmount)} / Spent:{" "}
          {formatMoney(budget.spentAmount)}
        </span>
      </div>
    </motion.div>
  );
};
export default BudgetCard;
