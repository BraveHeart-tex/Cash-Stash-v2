"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { openGenericModal } from "@/lib/genericModalUtils";
import { cn } from "@/lib/utils";
import { FaBullseye } from "react-icons/fa";

interface ICreateGoalButtonProps {
  className?: string;
}

const CreateGoalButton = ({ className }: ICreateGoalButtonProps) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={cn(
        "font-semibold text-md mt-3 flex items-center gap-[14px]",
        className
      )}
      data-testid="create-goal-button"
      onClick={() => openGenericModal("Goals", dispatch)}
    >
      <FaBullseye size={18} />
      Create a goal
    </Button>
  );
};
export default CreateGoalButton;
