"use client";

import AutoProgressInput from "@/components/auto-progress-input";
import { useEffect, useState, useTransition } from "react";
import { validateOTP } from "@/server/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import TwoFactorAuthenticationTimer from "@/components/two-factor-authentication-timer";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const TwoFactorAuthenticationForm = ({ email }: { email: string }) => {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (code.length === 6) {
      startTransition(async () => {
        const response = await validateOTP(code, email);

        if (response.error) {
          toast.error(response.error);
          if (response.redirectPath) {
            redirect(response.redirectPath);
          }
        }

        if (response.successMessage) {
          toast.success(response.successMessage);
        }
      });
    }
  }, [code, email]);

  return (
    <Card>
      <CardHeader className="text-xl">
        <Image
          src={"/logo.svg"}
          alt="Cash Stash"
          width={200}
          height={200}
          className="mb-4 dark:invert md:mx-auto"
        />
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Your account is protected with two-factor authentication. Please enter
          the 6-digit code from your authenticator app to log in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TwoFactorAuthenticationTimer />
        <div className="mt-4 flex w-full items-center justify-center">
          <div>
            <Label>Your 6-digit code</Label>
            <AutoProgressInput
              loading={isPending}
              length={6}
              onChange={setCode}
              shouldFocusFirstInput
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuthenticationForm;
