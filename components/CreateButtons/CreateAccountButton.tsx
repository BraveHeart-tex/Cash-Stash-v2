"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { openGenericModal } from "@/lib/genericModalUtils";
import { cn } from "@/lib/utils";
import { FaPiggyBank } from "react-icons/fa";

interface ICreateAccountButtonProps {
  className?: string;
}

const CreateAccountButton = ({ className }: ICreateAccountButtonProps) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      className={cn(
        "font-semibold text-md mt-3 flex items-center gap-[14px]",
        className
      )}
      data-testid="create-account-button"
      onClick={() => openGenericModal("Accounts", dispatch)}
    >
      <FaPiggyBank size={18} /> Create an account
    </Button>
  );
};
export default CreateAccountButton;
