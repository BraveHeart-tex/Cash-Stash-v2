"use client";

import { Progress } from "@/components/ui/progress";
import { useAppDispatch } from "@/app/redux/hooks";
import { Goal } from "@prisma/client";
import { cn } from "@/lib/utils";
import ActionPopover from "@/components/ActionPopover";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { deleteGoalByIdAction } from "@/actions";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { useToast } from "@/components/ui/use-toast";
import { SerializedGoal, fetchGoals } from "@/app/redux/features/goalSlice";

interface IGoalCardProps {
  goals: SerializedGoal[] | null;
}

const GoalCard = ({ goals }: IGoalCardProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleActionCallback = (
    result: Awaited<ReturnType<typeof deleteGoalByIdAction>>,
    cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
  ) => {
    if (result.error) {
      toast({
        title: "An error occurred.",
        description: result.error,
        variant: "destructive",
        duration: 5000,
      });
    } else {
      dispatch(fetchGoals());
      toast({
        title: "Goal deleted.",
        description: "The goal has been deleted.",
        variant: "default",
        duration: 5000,
      });
      dispatch(cleanUp());
    }
  };

  const handleDeleteGoal = (id: number) => {
    dispatch(
      showGenericConfirm({
        title: "Delete Goal",
        message: "Are you sure you want to delete this goal?",
        primaryActionLabel: "Delete",
        primaryAction: async () => deleteGoalByIdAction(id),
        resolveCallback: handleActionCallback,
      })
    );
  };

  return (
    <>
      {goals?.length === 0 && (
        <div>
          <p>No goals found. Add a goal to get started!</p>
        </div>
      )}
      {goals?.map((goal) => (
        <div
          className="flex flex-col gap-2 p-4 pt-6 border-1 shadow-xl rounded-md relative bg-card"
          key={goal.id}
        >
          <span>{goal.name}</span>
          <p className="text-primary mt-2">
            Current Progress: ${goal.currentAmount} / ${goal.goalAmount}
          </p>
          <Progress
            value={(goal.currentAmount / goal.goalAmount) * 100}
            className="mt-4"
            indicatorClassName={cn(
              goal.currentAmount / goal.goalAmount >= 1
                ? "bg-green-400"
                : "bg-blue-400"
            )}
          />
          <p className="mt-2 font-[300]">
            {goal.currentAmount / goal.goalAmount >= 1
              ? "Congrats! You have reached your goal!"
              : "Goal in progress... You've reached " +
                `${((goal.currentAmount / goal.goalAmount) * 100).toFixed(
                  0
                )}%` +
                " of your goal."}
          </p>
          <ActionPopover
            popoverHeading={"Goal Actions"}
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
            onDeleteActionClick={() => handleDeleteGoal(goal.id)}
          />
        </div>
      ))}
    </>
  );
};

export default GoalCard;
