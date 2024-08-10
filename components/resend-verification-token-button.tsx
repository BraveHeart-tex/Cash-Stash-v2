"use client";
import { Button } from "@/components/ui/button";
import { resendEmailVerificationCode } from "@/server/auth";
import { useTransition } from "react";
import { toast } from "sonner";

const ResendVerificationTokenButton = ({ email }: { email: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleRequestAgain = async () => {
    startTransition(async () => {
      const response = await resendEmailVerificationCode(email);

      if (response.isError) {
        toast.error("Failed to send verification code", {
          description: response.message,
        });
      } else {
        toast.success(response.message);
      }
    });
  };

  return (
    <Button
      variant="link"
      className="ml-1 p-0 underline"
      onClick={handleRequestAgain}
      disabled={isPending}
    >
      {isPending ? "Sending..." : "Request Again"}
    </Button>
  );
};
export default ResendVerificationTokenButton;
