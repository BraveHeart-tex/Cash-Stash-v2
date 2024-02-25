"use client";

import { useEffect, useState } from "react";
import AutoProgressInput from "../AutoProgressInput";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const EmailVerificationInput = () => {
  const [verificationCode, setVerificationCode] = useState("");

  const onVerify = () => {
    console.log("Verifying email");
  };

  useEffect(() => {
    if (verificationCode.length === 8) {
      onVerify();
    }
  }, [verificationCode.length]);

  return (
    <div className="mt-4 w-full flex lg:items-center lg:justify-center">
      <div className="gap-1 hidden lg:flex lg:flex-col">
        <Label htmlFor="verificationCode">Verification Code</Label>
        <AutoProgressInput
          label="Verification Code"
          length={8}
          onChange={setVerificationCode}
        />
      </div>
      <div className="lg:hidden w-full">
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
