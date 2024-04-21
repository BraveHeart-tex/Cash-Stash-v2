"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { FaMoneyBillAlt, FaPlus } from "react-icons/fa";

type CreateBudgetButtonProps = {
  className?: string;
  minimizeOnMobile?: boolean;
};

const CreateBudgetButton = ({
  className,
  minimizeOnMobile,
}: CreateBudgetButtonProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  return (
    <Button
      className={cn("font-semibold flex items-center gap-[14px]", className)}
      type="button"
      name="create-budget"
      aria-label="Create a budget"
      onClick={() =>
        openGenericModal({
          mode: "create",
          key: "budget",
          dialogTitle: "Create a budget",
          dialogDescription: "Fill out the form below to create a budget.",
        })
      }
    >
      <FaPlus
        className={cn("text-xl hidden", minimizeOnMobile && "inline md:hidden")}
      />

      <div
        className={cn(
          "flex items-center gap-2",
          minimizeOnMobile && "hidden md:flex"
        )}
      >
        <FaMoneyBillAlt size={18} /> Create a budget
      </div>
    </Button>
  );
};
export default CreateBudgetButton;
