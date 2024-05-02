"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { useTranslations } from "next-intl";
import { FaPiggyBank, FaPlus } from "react-icons/fa";

type CreateAccountButtonProps = {
  className?: string;
  minimizeOnMobile?: boolean;
};

const CreateAccountButton = ({
  className,
  minimizeOnMobile,
}: CreateAccountButtonProps) => {
  const t = useTranslations("Components.CreateAccountButton");
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  return (
    <Button
      className={cn("flex items-center gap-[14px] font-semibold", className)}
      type="button"
      name="create-account"
      aria-label={t("label")}
      onClick={() =>
        openGenericModal({
          mode: "create",
          key: "account",
          dialogTitle: t("createAccountDialogTitle"),
          dialogDescription: t("createAccountDialogMessage"),
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
        <FaPiggyBank size={18} /> {t("label")}
      </div>
    </Button>
  );
};
export default CreateAccountButton;
