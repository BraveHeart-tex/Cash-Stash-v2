"use client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import { deleteGoal } from "@/actions/goal";
import ActionPopover from "@/components/action-popover";
import { toast } from "sonner";
import { GoalSelectModel } from "@/lib/database/schema";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import { FaEdit, FaTrash } from "react-icons/fa";

interface IGoalCardProps {
  goal: GoalSelectModel;
}

const GoalCard = ({ goal }: IGoalCardProps) => {
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const router = useRouter();

  const handleDeleteGoal = (id: number) => {
    showGenericConfirm({
      title: "Delete Goal",
      message: "Are you sure you want to delete this goal?",
      primaryActionLabel: "Delete",
      onConfirm: async () => {
        const response = await deleteGoal(id);

        if (response?.error) {
          toast.error("An error occurred.", {
            description: response.error,
          });
        } else {
          router.refresh();
          toast.success("Goal deleted.", {
            description: "Selected goal has been deleted.",
          });
        }
      },
    });
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

  const handleEditGoal = () => {
    openGenericModal({
      dialogDescription: "Edit your goal information by using the form below.",
      dialogTitle: "Edit Goal",
      mode: "edit",
      key: "goal",
      entityId: goal.id,
      data: goal,
    });
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
            heading="Goal Actions"
            triggerClassName="top-0 right-0 mb-0"
            options={[
              {
                icon: FaEdit,
                label: "Edit",
                onClick: () => handleEditGoal(),
              },
              {
                icon: FaTrash,
                label: "Delete",
                onClick: () => handleDeleteGoal(goal.id),
              },
            ]}
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
        <p className="mt-4 text-foreground">
          Current: {formatMoney(goal.currentAmount)} / Target:{" "}
          {formatMoney(goal.goalAmount)}
        </p>
      </div>
    </motion.div>
  );
};

export default GoalCard;
