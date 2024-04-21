"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { FaPiggyBank, FaPlus } from "react-icons/fa";

type CreateAccountButtonProps = {
  className?: string;
  minimizeOnMobile?: boolean;
};

const CreateAccountButton = ({
  className,
  minimizeOnMobile,
}: CreateAccountButtonProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  return (
    <Button
      className={cn("flex items-center gap-[14px] font-semibold", className)}
      type="button"
      name="create-account"
      aria-label="Create an account"
      onClick={() =>
        openGenericModal({
          mode: "create",
          key: "account",
          dialogTitle: "Register Bank Account",
          dialogDescription:
            "Fill out the form below to register your bank account.",
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
        <FaPiggyBank size={18} /> Create an account
      </div>
    </Button>
  );
};
export default CreateAccountButton;
