"use client";

import AutoProgressInput from "@/components/auto-progress-input";
import { useEffect, useState, useTransition } from "react";
import { validateOTP } from "@/data/auth";

const TwoFactorAuthenticationForm = ({ email }: { email: string }) => {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (code.length === 6) {
      startTransition(async () => {
        await validateOTP(code, email);
      });
    }
  }, [code]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <h1>Two Factor Authentication</h1>
      <p>Please enter the 6-digit code from your authenticator app.</p>
      {isPending ? (
        <p>Validating...</p>
      ) : (
        <AutoProgressInput length={6} onChange={setCode} />
      )}
    </div>
  );
};

export default TwoFactorAuthenticationForm;
