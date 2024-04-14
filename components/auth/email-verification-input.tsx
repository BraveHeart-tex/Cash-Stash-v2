"use client";

import { useCallback, useEffect, useState } from "react";
import AutoProgressInput from "@/components/auto-progress-input";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleEmailVerification } from "@/actions/auth";
import { EMAIL_VERIFICATION_CODE_LENGTH } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EmailVerificationInput = ({ email }: { email: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const verifyEmail = useCallback(async () => {
    setLoading(true);
    const result = await handleEmailVerification(email, verificationCode);
    if (result?.error) {
      setLoading(false);
      toast.error(result.error);
      setErrorMessage(result.error);

      if (result?.redirectPath) {
        router.push(result.redirectPath);
      }
    }

    if (result?.successMessage) {
      setLoading(false);
      toast.success(result.successMessage);
    }
  }, [email, verificationCode, router]);

  useEffect(() => {
    if (verificationCode.length === EMAIL_VERIFICATION_CODE_LENGTH) {
      verifyEmail();
    }
  }, [email, verificationCode, verifyEmail]);

  return (
    <div className="mt-4 w-full flex lg:items-center lg:justify-center">
      <div className="gap-1 hidden lg:flex lg:flex-col">
        <Label htmlFor="verificationCode">Verification Code</Label>
        <AutoProgressInput
          length={EMAIL_VERIFICATION_CODE_LENGTH}
          onChange={setVerificationCode}
          loading={loading}
          shouldFocusFirstInput
        />
      </div>
      <div className="lg:hidden w-full">
        {errorMessage && <p className="text-destructive">{errorMessage}</p>}
        <Label htmlFor="verificationCode">Verification Code</Label>
        <Input
          className="w-full"
          maxLength={EMAIL_VERIFICATION_CODE_LENGTH}
          name="verificationCode"
          disabled={loading}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
      </div>
    </div>
  );
};
export default EmailVerificationInput;
