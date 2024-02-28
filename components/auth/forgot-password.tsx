"use client";
import { FormEvent, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "../ui/use-toast";

const ForgotPassword = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    const email = inputRef.current?.value;
    if (!email) {
      showErrorToast("Error", "Please enter your email");
      return;
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" ref={inputRef} required />
      </div>
      <Button type="submit" className="w-full mt-2">
        Reset Password
      </Button>
    </form>
  );
};

export default ForgotPassword;
