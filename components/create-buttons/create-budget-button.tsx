"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { FaMoneyBillAlt, FaPlus } from "react-icons/fa";

type CreateBudgetButtonInternalizationConfig = {
  buttonLabel: string;
  dialogTitle: string;
  dialogDescription: string;
};

type CreateBudgetButtonProps = {
  className?: string;
  minimizeOnMobile?: boolean;
  internalizationConfig: CreateBudgetButtonInternalizationConfig;
};

const CreateBudgetButton = ({
  className,
  minimizeOnMobile,
  internalizationConfig,
}: CreateBudgetButtonProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const { buttonLabel, dialogTitle, dialogDescription } = internalizationConfig;

  return (
    <Button
      className={cn("flex items-center gap-[14px] font-semibold", className)}
      type="button"
      name="create-budget"
      aria-label={buttonLabel}
      onClick={() =>
        openGenericModal({
          mode: "create",
          key: "budget",
          dialogTitle,
          dialogDescription,
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
        <FaMoneyBillAlt size={18} /> {buttonLabel}
      </div>
    </Button>
  );
};
export default CreateBudgetButton;
