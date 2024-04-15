"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/stringUtils/cn";
import useGenericModalStore from "@/store/genericModalStore";
import { FaPiggyBank } from "react-icons/fa";

type CreateAccountButtonProps = {
  className?: string;
};

const CreateAccountButton = ({ className }: CreateAccountButtonProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  return (
    <Button
      className={cn(
        "font-semibold mt-3 flex items-center gap-[14px]",
        className
      )}
      data-testid="create-account-button"
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
      <FaPiggyBank size={18} /> Create an account
    </Button>
  );
};
export default CreateAccountButton;
