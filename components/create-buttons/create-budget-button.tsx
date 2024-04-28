"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { useTranslations } from "next-intl";
import { FaMoneyBillAlt, FaPlus } from "react-icons/fa";

type CreateBudgetButtonInternalizationConfig = {
  buttonLabel: string;
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
  const { buttonLabel } = internalizationConfig;

  return (
    <Button
      className={cn("flex items-center gap-[14px] font-semibold", className)}
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
