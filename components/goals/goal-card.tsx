"use client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch } from "@/redux/hooks";
import ActionPopover from "@/components/action-popover";
import { openGenericModal } from "@/redux/features/genericModalSlice";
import { showGenericConfirm } from "@/redux/features/genericConfirmSlice";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { deleteGeneric } from "@/actions/generic";
import { Goal } from "@prisma/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn, formatMoney } from "@/lib/utils";

interface IGoalCardProps {
  goal: Goal;
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

  const getGoalProgressColor = (progress: number): string => {
    if (progress >= 100) return "bg-success";
    if (progress >= 75) return "bg-success/80";
    return "bg-primary";
  };

  const getBadgeColor = (progress: number): string => {
    if (progress >= 100) return "bg-success hover:bg-success/90";
    if (progress >= 75) return "bg-success/80 hover:bg-success/90";
    return "bg-primary hover:bg-bg-primary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 20 }}
      layoutId={`goal-card-${goal.id}`}
      className="flex flex-col gap-2 p-4 pt-6 border-1 shadow-xl rounded-md relative bg-card border cursor-pointer"
    >
      <p className="font-semibold text-foreground">{goal.name}</p>
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
                  data: goal,
                })
              )
            }
            placementClasses="top-0 right-0 mb-0"
            onDeleteActionClick={() => handleDeleteGoal(goal.id)}
          />
          <Badge className={cn("ml-auto", getBadgeColor(goal.progress))}>
            {goal.progress >= 100 ? "Completed!" : `${goal.progress}%`}
          </Badge>
        </div>
      </div>
      <div className="mt-2">
        <Progress
          value={goal.progress >= 100 ? 100 : goal.progress}
          indicatorClassName={getGoalProgressColor(goal.progress)}
        />
        <p className="mt-4 text-md text-foreground">
          Current: {formatMoney(goal.currentAmount)} / Target:{" "}
          {formatMoney(goal.goalAmount)}
        </p>
      </div>
    </motion.div>
  );
};

export default GoalCard;
