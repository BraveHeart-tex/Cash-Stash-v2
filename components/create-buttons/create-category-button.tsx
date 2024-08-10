"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import { useRouter } from "@/navigation";
import useGenericModalStore from "@/store/genericModalStore";
import { useTranslations } from "next-intl";
import { FaPlus } from "react-icons/fa";

type CreateCategoryButtonProps = {
  className?: string;
};

const CreateCategoryButton = ({ className }: CreateCategoryButtonProps) => {
  const t = useTranslations("Components.CreateCategoryButton");
  const router = useRouter();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal,
  );
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal,
  );

  const buttonLabel = t("buttonLabel");

  return (
    <Button
      className={cn("flex items-center gap-2 font-semibold", className)}
      aria-label={buttonLabel}
      data-testid="create-account-button"
      onClick={() =>
        openGenericModal({
          mode: "create",
          key: "category",
          dialogTitle: buttonLabel,
          dialogDescription: t("createCategoryDialogMessage"),
          props: {
            afterSave: () => {
              router.refresh();
              closeGenericModal();
            },
          },
        })
      }
    >
      <FaPlus />
      <span className="hidden md:inline">{buttonLabel}</span>
    </Button>
  );
};
export default CreateCategoryButton;
