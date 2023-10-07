"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  SerializedBudget,
  fetchBudgets,
} from "@/app/redux/features/budgetSlice";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import ActionPopover from "@/components/ActionPopover";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { deleteBudgetByIdAction } from "@/actions";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";

interface IBudgetCardsProps {
  budgets: SerializedBudget[] | null;
}

const BudgetCards = ({ budgets }: IBudgetCardsProps) => {
  const dispatch = useAppDispatch();

  const handleActionCallback = (
    result: Awaited<ReturnType<typeof deleteBudgetByIdAction>>,
    cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
  ) => {
    if (result?.error) {
      showErrorToast("An error occurred.", result.error);
    } else {
      showSuccessToast("Budget deleted.", "Selected budget has been deleted.");
      dispatch(cleanUp());
      dispatch(fetchBudgets());
    }
  };

  return (
    <>
      {budgets?.length
        ? budgets.map((budget) => (
            <div
              key={budget.id}
              className="flex flex-col gap-2 p-4 pt-6 border-1 shadow-xl rounded-md relative bg-card"
            >
              <span>{budget.category}</span>
              <div className="absolute top-3 right-1 mb-2">
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
                          message:
                            "Are you sure you want to delete this budget?",
                          primaryActionLabel: "Delete",
                          primaryAction: () =>
                            deleteBudgetByIdAction(budget.id),
                          resolveCallback: handleActionCallback,
                        })
                      )
                    }
                    isAbsolute={false}
                    placementClasses="top-0 right-0 mb-0"
                  />
                  <Badge
                    className={cn(
                      " select-none cursor-pointer",
                      budget.spentAmount / budget.budgetAmount > 0.5
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-400 hover:bg-green-500"
                    )}
                  >
                    {((budget.spentAmount / budget.budgetAmount) * 100).toFixed(
                      0
                    )}
                    %
                  </Badge>
                </div>
              </div>
              <Progress
                value={(budget.spentAmount / budget.budgetAmount) * 100}
                className="mt-4"
                indicatorClassName={cn(
                  budget.spentAmount / budget.budgetAmount > 0.7
                    ? "bg-red-500"
                    : budget.spentAmount / budget.budgetAmount > 0.4
                    ? "bg-orange-500"
                    : "bg-green-400"
                )}
              />
              <div className="w-full flex items-center justify-between mt-2">
                <span>
                  Budget: ${budget.budgetAmount} / Spent: ${budget.spentAmount}
                </span>
                <p className="text-primart font-[300]">
                  {budget.spentAmount / budget.budgetAmount > 1
                    ? "You are over budget!"
                    : budget.spentAmount / budget.budgetAmount > 0.7
                    ? "You are almost over budget!"
                    : budget.spentAmount / budget.budgetAmount > 0.4
                    ? "You are halfway to your budget!"
                    : "You are under budget!"}
                </p>
              </div>
            </div>
          ))
        : null}
    </>
  );
};

export default BudgetCards;
