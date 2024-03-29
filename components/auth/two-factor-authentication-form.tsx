"use client";

import AutoProgressInput from "@/components/auto-progress-input";
import { useEffect, useState, useTransition } from "react";
import { validateOTP } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import logo from "@/components/Logo.svg";
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
          src={logo}
          alt="Cash Stash"
          width={200}
          className="mb-4 md:mx-auto dark:invert"
        />
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Your account is protected with two-factor authentication. Please enter
          the 6-digit code from your authenticator app to log in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TwoFactorAuthenticationTimer />
        <div className="w-full flex items-center justify-center mt-4">
          <div>
            <Label>Your 6-digit code</Label>
            <AutoProgressInput
              loading={isPending}
              length={6}
              onChange={setCode}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuthenticationForm;
