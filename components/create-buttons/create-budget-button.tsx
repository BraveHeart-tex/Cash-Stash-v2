"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { FaMoneyBillAlt } from "react-icons/fa";

type CreateBudgetButtonProps = {
  className?: string;
};

const CreateBudgetButton = ({ className }: CreateBudgetButtonProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  return (
    <Button
      className={cn(
        "font-semibold mt-3 flex items-center gap-[14px]",
        className
      )}
      data-testid="create-budget-button"
      onClick={() =>
        openGenericModal({
          mode: "create",
          key: "budget",
          dialogTitle: "Create a budget",
          dialogDescription: "Fill out the form below to create a budget.",
        })
      }
    >
      <FaMoneyBillAlt size={18} /> Create a budget
    </Button>
  );
};
export default CreateBudgetButton;
