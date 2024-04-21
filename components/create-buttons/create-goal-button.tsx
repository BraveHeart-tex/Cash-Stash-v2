"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { FaBullseye, FaPlus } from "react-icons/fa";

type CreateGoalButtonProps = {
  className?: string;
  minimizeOnMobile?: boolean;
};

const CreateGoalButton = ({
  className,
  minimizeOnMobile,
}: CreateGoalButtonProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );

  return (
    <Button
      className={cn("flex items-center gap-[14px] font-semibold", className)}
      type="button"
      name="create-goal"
      aria-label="Create a goal"
      onClick={() =>
        openGenericModal({
          mode: "create",
          dialogTitle: "Create Goal",
          dialogDescription: "Create a new goal by filling out the form below.",
          key: "goal",
        })
      }
    >
      <FaPlus
        className={cn("hidden text-xl", minimizeOnMobile && "inline md:hidden")}
      />
      <div
        className={cn(
          "flex items-center gap-2",
          minimizeOnMobile && "hidden md:flex"
        )}
      >
        <FaBullseye size={18} />
        Create a goal
      </div>
    </Button>
  );
};
export default CreateGoalButton;
