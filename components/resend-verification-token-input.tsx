"use client";
import { FormEvent, useRef, useTransition } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { resendEmailVerificationCode } from "@/actions/auth";
import { showErrorToast, showSuccessToast } from "./ui/use-toast";

const ResendNotificationInput = () => {
  let [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const email = ref.current?.value;
    if (!email) return;

    startTransition(async () => {
      const response = await resendEmailVerificationCode(email);
      if (response.isError) {
        showErrorToast(response.message);
      }

      showSuccessToast(response.message);
      ref.current!.value = "";
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          ref={ref}
          id="email"
          type="email"
          name="email"
          required
          placeholder="Enter your email address"
        />
      </div>
      <Button
        type="submit"
        name="Resend verification token"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Resend verification token"}
      </Button>
    </form>
  );
};

export default ResendNotificationInput;
