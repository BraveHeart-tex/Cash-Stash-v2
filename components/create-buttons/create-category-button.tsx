"use client";
import { cn } from "@/lib/utils/stringUtils/cn";
import { Button } from "@/components/ui/button";
import useGenericModalStore from "@/store/genericModalStore";
import { FaPlus } from "react-icons/fa";

type CreateCategoryButtonProps = {
  className?: string;
};

const CreateCategoryButton = ({ className }: CreateCategoryButtonProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );

  return (
    <Button
      className={cn("font-semibold flex items-center gap-2", className)}
      data-testid="create-account-button"
      onClick={() =>
        openGenericModal({
          mode: "create",
          key: "category",
          dialogTitle: "Create a category",
          dialogDescription: "Use the form below to create a new category.",
        })
      }
    >
      <FaPlus />
      <span className="hidden md:inline">Create a category</span>
    </Button>
  );
};
export default CreateCategoryButton;
