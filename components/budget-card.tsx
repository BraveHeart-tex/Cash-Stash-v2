"use client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import useGenericModalStore from "@/store/genericModalStore";
import { deleteBudget } from "@/actions/budget";
import ActionPopover from "@/components/action-popover";
import { toast } from "sonner";
import { BudgetSelectModel } from "@/lib/database/schema";
import { formatMoney } from "@/lib/utils/numberUtils/formatMoney";
import { cn } from "@/lib/utils/stringUtils/cn";
import { generateLabelFromEnumValue } from "@/lib/utils/stringUtils/generateLabelFromEnumValue";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAuthStore from "@/store/auth/authStore";

interface IBudgetCardProps {
  budget: BudgetSelectModel;
}

const BudgetCard = ({ budget }: IBudgetCardProps) => {
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

  const handleDeleteClick = (id: number) => {
    showGenericConfirm({
      title: "Delete Budget",
      message: "Are you sure you want to delete this budget?",
      primaryActionLabel: "Delete",
      onConfirm: async () => {
        const response = await deleteBudget(id);

        if (response?.error) {
          toast.error("An error occurred.", {
            description: response.error,
          });
        } else {
          router.refresh();

          toast.success("Budget deleted.", {
            description: "Selected budget has been deleted.",
          });
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
      dialogTitle: "Edit Budget",
      dialogDescription:
        "Edit your budget information by using the form below.",
      entityId: budget.id,
      mode: "edit",
      key: "budget",
      data: budget,
    });
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
          {generateLabelFromEnumValue(budget.category)}
        </span>
      </div>
      <div className="absolute top-5 right-1 mb-2">
        <div className="flex items-center gap-1">
          <ActionPopover
            heading="Budget Actions"
            triggerClassName="top-0 right-0 mb-0"
            options={[
              {
                icon: FaEdit,
                label: "Edit",
                onClick: () => handleEditClick(),
              },
              {
                icon: FaTrash,
                label: "Delete",
                onClick: () => handleDeleteClick(budget.id),
              },
            ]}
          />
          <Badge
            className={cn(
              "select-none cursor-pointer",
              getBadgeColor(budget.spentAmount / budget.budgetAmount)
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
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between mt-2">
        <span className="text-foreground">
          Budget: {formatMoney(budget.budgetAmount, preferredCurrency)} / Spent:{" "}
          {formatMoney(budget.spentAmount, preferredCurrency)}
        </span>
      </div>
    </motion.div>
  );
};
export default BudgetCard;
