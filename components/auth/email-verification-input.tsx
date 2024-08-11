"use client";

import AutoProgressInput from "@/components/auto-progress-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMAIL_VERIFICATION_CODE_LENGTH } from "@/lib/constants";
import { useRouter } from "@/navigation";
import { handleEmailVerification } from "@/server/auth";
import { useCallback, useEffect, useState } from "react";
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
  }, [verificationCode, verifyEmail]);

  return (
    <div className="mt-4 flex w-full lg:items-center lg:justify-center">
      <div className="hidden gap-1 lg:flex lg:flex-col">
        <Label htmlFor="verificationCode">Verification Code</Label>
        <AutoProgressInput
          length={EMAIL_VERIFICATION_CODE_LENGTH}
          onChange={setVerificationCode}
          loading={loading}
        />
      </div>
      <div className="w-full lg:hidden">
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
