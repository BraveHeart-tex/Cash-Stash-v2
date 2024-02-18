"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { openGenericModal } from "@/lib/genericModalUtils";
import { cn } from "@/lib/utils";
import { FaMoneyBillAlt } from "react-icons/fa";

interface ICreateBudgetButtonProps {
  className?: string;
}

const CreateBudgetButton = ({ className }: ICreateBudgetButtonProps) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={cn(
        "font-semibold text-md mt-3 flex items-center gap-[14px]",
        className
      )}
      data-testid="create-budget-button"
      onClick={() => openGenericModal("Budgets", dispatch)}
    >
      <FaMoneyBillAlt size={18} /> Create a budget
    </Button>
  );
};
export default CreateBudgetButton;
