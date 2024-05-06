"use client";
import { redirect } from "@/navigation";
import CountDownTimer from "@/components/countdown-timer";
import {
  EMAIL_VERIFICATION_CODE_EXPIRY_SECONDS,
  EMAIL_VERIFICATION_REDIRECTION_PATHS,
} from "@/lib/constants";
import { toast } from "sonner";

const EmailVerificationTimer = ({ time }: { time: number }) => {
  const handleTimerEnd = () => {
    toast.error("Verification time expired.", {
      description:
        "You waited too long to verify your email. Please request a new verification code.",
    });
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
