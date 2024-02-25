"use client";

import { useState } from "react";
import AutoProgressInput from "../AutoProgressInput";

const EmailVerificationInput = () => {
  const [verificationCode, setVerificationCode] = useState("");

  return (
    <div className="mt-4">
      CODE: {verificationCode}
      <AutoProgressInput length={6} onChange={setVerificationCode} />
    </div>
  );
};
export default EmailVerificationInput;
