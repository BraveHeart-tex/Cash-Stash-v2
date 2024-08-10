"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { useTranslations } from "next-intl";
import { FaBullseye, FaPlus } from "react-icons/fa";

type CreateGoalButtonProps = {
  className?: string;
  minimizeOnMobile?: boolean;
};

const CreateGoalButton = ({
  className,
  minimizeOnMobile,
}: CreateGoalButtonProps) => {
  const t = useTranslations("Components.CreateGoalButton");
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal,
  );

  const label = t("label");

  return (
    <Button
      className={cn("flex items-center gap-[14px] font-semibold", className)}
      type="button"
      name="create-goal-button"
      aria-label={label}
      onClick={() =>
        openGenericModal({
          mode: "create",
          dialogTitle: t("createGoalDialogTitle"),
          dialogDescription: t("createGoalDialogMessage"),
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
          minimizeOnMobile && "hidden md:flex",
        )}
      >
        <FaBullseye size={18} />
        {label}
      </div>
    </Button>
  );
};
export default CreateGoalButton;
