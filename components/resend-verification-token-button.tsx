"use client";
import { resendEmailVerificationCode } from "@/data/auth";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";

const ResendVerificationTokenButton = ({ email }: { email: string }) => {
  let [isPending, startTransition] = useTransition();

  const handleRequestAgain = async () => {
    startTransition(async () => {
      const response = await resendEmailVerificationCode(email);
      if (response.isError) {
        showErrorToast("Failed to send verification code", response.message);
      } else {
        showSuccessToast(response.message);
      }
    });
  };

  return (
    <Button
      variant="link"
      className="p-0 ml-1 underline"
      onClick={handleRequestAgain}
      disabled={isPending}
    >
      {isPending ? "Sending..." : "Request Again"}
    </Button>
  );
};
export default ResendVerificationTokenButton;
