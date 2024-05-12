"use client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useRouter } from "@/navigation";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import { deleteGoal } from "@/server/goal";
import ActionPopover from "@/components/action-popover";
import { toast } from "sonner";
import { GoalSelectModel } from "@/lib/database/schema";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAuthStore from "@/store/auth/authStore";
import { useTranslations } from "next-intl";

type GoalCardProps = {
  goal: GoalSelectModel;
};

const GoalCard = ({ goal }: GoalCardProps) => {
  const t = useTranslations("Components.GoalCard");
  const preferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency
  );
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const router = useRouter();

  const handleDeleteGoal = (id: number) => {
    showGenericConfirm({
      title: t("deleteGoalDialogTitle"),
      message: t("deleteGoalDialogMessage"),
      primaryActionLabel: t("deleteGoalDialogPrimaryActionLabel"),
      onConfirm: async () => {
        const response = await deleteGoal(id);

        if (response?.error) {
          toast.error(t("anErrorOccurredMessage"), {
            description: response.error,
          });
        } else {
          router.refresh();
          toast.success(response.data);
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
      dialogDescription: t("editGoalDialogDescription"),
      dialogTitle: t("editGoalDialogTitle"),
      mode: "edit",
      key: "goal",
      entityId: goal.id,
      data: goal,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 20 }}
      layoutId={`goal-card-${goal.id}`}
      className="border-1 relative flex flex-col gap-2 rounded-md border bg-card p-4 pt-6 shadow-sm"
    >
      <p className="font-semibold text-foreground">{goal.name}</p>
      <div className="absolute right-1 top-3 mb-2">
        <div className="flex items-center">
          <ActionPopover
            heading={t("PopoverActions.title")}
            triggerClassName="top-0 right-0 mb-0"
            options={[
              {
                icon: FaEdit,
                label: t("PopoverActions.edit"),
                onClick: () => handleEditGoal(),
              },
              {
                icon: FaTrash,
                label: t("PopoverActions.delete"),
                onClick: () => handleDeleteGoal(goal.id),
              },
            ]}
          />

          <Badge className={cn("ml-auto", getBadgeColor(goal.progress))}>
            {goal.progress >= 100
              ? t("goalCompletedLabel")
              : `${goal.progress}%`}
          </Badge>
        </div>
      </div>
      <div className="mt-2">
        <Progress
          value={goal.progress >= 100 ? 100 : goal.progress}
          indicatorClassName={getGoalProgressColor(goal.progress)}
        />
        <p className="mt-4 text-foreground">
          <span className="font-medium">{t("currentLabel")}</span>:{" "}
          <span className="text-primary">
            {formatMoney(goal.currentAmount, preferredCurrency)}
          </span>{" "}
          / <span className="font-medium"> {t("targetLabel")}</span>:{" "}
          <span className="text-primary">
            {formatMoney(goal.goalAmount, preferredCurrency)}
          </span>
        </p>
      </div>
    </motion.article>
  );
};

export default GoalCard;
