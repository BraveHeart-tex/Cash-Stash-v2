"use client";
import ActionPopover from "@/components/action-popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import { useRouter } from "@/navigation";
import { deleteBudget } from "@/server/budget";
import useAuthStore from "@/store/auth/authStore";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import type { BudgetWithCategory } from "@/typings/budgets";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

type BudgetCardProps = {
  budget: BudgetWithCategory;
};

const BudgetCard = ({ budget }: BudgetCardProps) => {
  const t = useTranslations("Components.BudgetCard");
  const preferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency,
  );
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm,
  );
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal,
  );
  const router = useRouter();

  const handleDeleteClick = (id: number) => {
    showGenericConfirm({
      title: t("deleteBudgetDialogTitle"),
      message: t("deleteBudgetDialogMessage"),
      primaryActionLabel: t("deleteBudgetDialogPrimaryActionLabel"),
      onConfirm: async () => {
        const response = await deleteBudget(id);

        if (response?.error) {
          toast.error(t("deleteBudgetErrorMessage"), {
            description: response.error,
          });
        } else {
          router.refresh();

          toast.success(t("deleteBudgetSuccessMessage"));
        }
      },
    });
  };

  const getProgressColor = (progress: number): string => {
    if (progress > 70) return "bg-destructive";
    if (progress > 60) return "bg-orange-500";
    return "bg-success";
  };

  const getBadgeColor = (progress: number): string => {
    if (progress > 0.7) return "bg-destructive hover:bg-destructive";
    if (progress > 0.6) return "bg-orange-500 hover:bg-orange-500";
    return "bg-success hover:bg-success";
  };

  const handleEditClick = () => {
    openGenericModal({
      dialogTitle: t("editBudgetDialogTitle"),
      dialogDescription: t("editBudgetDialogMessage"),
      entityId: budget.id,
      mode: "edit",
      key: "budget",
      data: budget,
    });
  };

  return (
    <motion.div
      transition={{ duration: 0.6, type: "tween" }}
      layoutId={`budget-card-${budget.id}`}
      key={budget.id}
      className="border-1 relative flex flex-col gap-2 rounded-md border bg-card p-4 pt-6 shadow-sm"
    >
      <div className="flex flex-col gap-1 p-0">
        <span className="text-lg font-semibold text-foreground">
          {budget.name}
        </span>
        <span className="text-muted-foreground">{budget.category}</span>
      </div>
      <div className="absolute right-1 top-5 mb-2">
        <div className="flex items-center gap-1">
          <ActionPopover
            heading={t("budgetActionsHeading")}
            triggerClassName="top-0 right-0 mb-0"
            options={[
              {
                icon: FaEdit,
                label: t("budgetActionsEditLabel"),
                onClick: () => handleEditClick(),
              },
              {
                icon: FaTrash,
                label: t("budgetActionsDeleteLabel"),
                onClick: () => handleDeleteClick(budget.id),
              },
            ]}
          />
          <Badge
            className={cn(
              "select-none",
              getBadgeColor(budget.spentAmount / budget.budgetAmount),
            )}
          >
            {budget.progress.toFixed(0)}%
          </Badge>
        </div>
      </div>
      <Progress
        value={budget.progress}
        className="mt-4"
        indicatorClassName={getProgressColor(budget.progress)}
      />
      <div className="mt-2 flex w-full flex-col justify-between lg:flex-row lg:items-center">
        <span className="text-foreground">
          {t("budgetSpent", {
            budget: formatMoney(budget.budgetAmount, preferredCurrency),
            spent: formatMoney(budget.spentAmount, preferredCurrency),
          })}
        </span>
      </div>
    </motion.div>
  );
};
export default BudgetCard;
