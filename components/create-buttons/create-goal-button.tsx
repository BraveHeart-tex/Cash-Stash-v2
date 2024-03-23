"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { FaBullseye } from "react-icons/fa";

interface ICreateGoalButtonProps {
  className?: string;
}

const CreateGoalButton = ({ className }: ICreateGoalButtonProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );

  return (
    <Button
      className={cn(
        "font-semibold mt-3 flex items-center gap-[14px]",
        className
      )}
      data-testid="create-goal-button"
      onClick={() =>
        openGenericModal({
          mode: "create",
          dialogTitle: "Create Goal",
          dialogDescription: "Create a new goal by filling out the form below.",
          key: "goal",
        })
      }
    >
      <FaBullseye size={18} />
      Create a goal
    </Button>
  );
};
export default CreateGoalButton;
