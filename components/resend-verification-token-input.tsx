"use client";
import { FormEvent, useRef, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resendEmailVerificationCode } from "@/server/auth";
import { toast } from "sonner";

const ResendVerificationEmailInput = () => {
  let [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const email = ref.current?.value;
    if (!email) return;

    startTransition(async () => {
      const response = await resendEmailVerificationCode(email);
      ref.current!.value = "";
      if (response.isError) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
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

export default ResendVerificationEmailInput;
