"use client";
import { redirect } from "next/navigation";
import CountDownTimer from "@/components/countdown-timer";
import {
  EMAIL_VERIFICATION_CODE_EXPIRY_SECONDS,
  EMAIL_VERIFICATION_REDIRECTION_PATHS,
} from "@/lib/constants";
import { showErrorToast } from "@/components/ui/use-toast";

const EmailVerificationTimer = ({ time }: { time: number }) => {
  const handleTimerEnd = () => {
    showErrorToast(
      "Verification time expired",
      "Please request a new verification code."
    );
    redirect(EMAIL_VERIFICATION_REDIRECTION_PATHS.VERIFICATION_TIMEOUT);
  };

  return (
    <CountDownTimer
      countDownFrom={EMAIL_VERIFICATION_CODE_EXPIRY_SECONDS}
      className="mt-2 w-full text-center text-2xl"
      timer={time}
      options={{
        progressBarType: "linear",
      }}
      onTimerEnd={handleTimerEnd}
    />
  );
};
export default EmailVerificationTimer;
