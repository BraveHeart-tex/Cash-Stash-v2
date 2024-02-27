"use client";

import { useCallback, useEffect, useState } from "react";
import AutoProgressInput from "@/components/auto-progress-input";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleEmailVerification } from "@/data/auth";
import { showErrorToast, showSuccessToast } from "../ui/use-toast";
import { EMAIL_VERIFICATION_CODE_LENGTH } from "@/lib/constants";

const EmailVerificationInput = ({ email }: { email: string }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const verifyEmail = useCallback(async () => {
    const result = await handleEmailVerification(email, verificationCode);
    if (result.error) {
      showErrorToast("Error verifying email", result.error);
      setErrorMessage(result.error);
      return;
    }

    if (result.successMessage) {
      showSuccessToast(result.successMessage);
    }
  }, [email, verificationCode]);

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
        />
      </div>
      <div className="lg:hidden w-full">
        {errorMessage && <p className="text-destructive">{errorMessage}</p>}
        <Label htmlFor="verificationCode">Verification Code</Label>
        <Input
          className="w-full"
          maxLength={8}
          name="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
      </div>
    </div>
  );
};
export default EmailVerificationInput;
