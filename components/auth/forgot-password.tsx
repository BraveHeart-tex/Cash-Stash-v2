"use client";
import { FormEvent, useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { sendPasswordResetEmail } from "@/data/auth";

const ForgotPassword = () => {
  let [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    const email = inputRef.current?.value;
    if (!email) {
      showErrorToast("Error", "Please enter your email");
      return;
    }

    startTransition(async () => {
      const response = await sendPasswordResetEmail(email);
      if (response?.isError) {
        showErrorToast("Error", response.message);
        return;
      }

      showSuccessToast(response.message);
    });
  };

  return (
    <form onSubmit={handleResetPassword}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" ref={inputRef} required />
      </div>
      <Button type="submit" className="w-full mt-2" disabled={isPending}>
        {isPending ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
};

export default ForgotPassword;
