"use client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch } from "@/app/redux/hooks";
import ActionPopover from "@/components/ActionPopover";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { SerializedGoal } from "@/app/redux/features/goalSlice";
import { deleteGeneric } from "@/actions/generic";
import { Goal } from "@prisma/client";
import { useRouter } from "next/navigation";

interface IGoalCardProps {
  goal: SerializedGoal;
}

const GoalCard = ({ goal }: IGoalCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDeleteGoal = (id: string) => {
    const handleActionCallback = (
      result: Awaited<ReturnType<typeof deleteGeneric>>,
      cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
    ) => {
      if (result?.error) {
        showErrorToast("An error occurred.", result.error as string);
      } else {
        router.refresh();
        showSuccessToast("Goal deleted.", "Selected goal has been deleted.");
        dispatch(cleanUp());
      }
    };

    dispatch(
      showGenericConfirm({
        title: "Delete Goal",
        message: "Are you sure you want to delete this goal?",
        primaryActionLabel: "Delete",
        primaryAction: async () =>
          await deleteGeneric<Goal>({
            tableName: "goal",
            whereCondition: { id },
          }),
        resolveCallback: handleActionCallback,
      })
    );
  };

  return (
    <div
      className="flex flex-col gap-2 p-4 pt-6 border-1 shadow-xl rounded-md relative bg-card border cursor-pointer"
      key={goal.name}
    >
      <p className="font-semibold dark:text-white/60 text-foreground">
        {goal.name}
      </p>
      <div className="absolute top-3 right-1 mb-2">
        <div className="flex items-center">
          <ActionPopover
            popoverHeading={"Goal Actions"}
            isAbsolute={false}
            onEditActionClick={() =>
              dispatch(
                openGenericModal({
                  dialogDescription:
                    "Edit your goal information by using the form below.",
                  dialogTitle: "Edit Goal",
                  mode: "edit",
                  key: "goal",
                  entityId: goal.id,
                })
              )
            }
            placementClasses="top-0 right-0 mb-0"
            onDeleteActionClick={() => handleDeleteGoal(goal.id)}
          />
          <Badge className="ml-auto">
            {goal.currentAmount / goal.goalAmount >= 1
              ? "Completed!"
              : `In Progress ${Math.round(
                  (goal.currentAmount / goal.goalAmount) * 100
                )}%`}
          </Badge>
        </div>
      </div>
      <div className="mt-2">
        <Progress
          value={(goal.currentAmount / goal.goalAmount) * 100}
          indicatorClassName={
            goal.currentAmount / goal.goalAmount > 0.7
              ? "bg-green-200"
              : goal.currentAmount / goal.goalAmount > 0.4
              ? "bg-orange-300"
              : "bg-red-300"
          }
        />
        <p className="mt-4 text-md dark:text-white/60 text-foreground">
          Current: {goal.currentAmount}₺ / Target: {goal.goalAmount}₺
        </p>
      </div>
    </div>
  );
};

export default GoalCard;
