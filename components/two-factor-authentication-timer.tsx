"use client";
import CountDownTimer from "@/components/countdown-timer";
import {
  EMAIL_VERIFICATION_REDIRECTION_PATHS,
  TWO_FACTOR_AUTH_INPUT_TIMEOUT_SECONDS,
} from "@/lib/constants";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const TwoFactorAuthenticationTimer = () => {
  const onCountDownEnd = () => {
    toast.error("Verification timeout. Please try logging in again.");
    redirect(EMAIL_VERIFICATION_REDIRECTION_PATHS.VERIFICATION_TIMEOUT);
  };

  return (
    <div className="w-full">
      <CountDownTimer
        countDownFrom={TWO_FACTOR_AUTH_INPUT_TIMEOUT_SECONDS}
        timer={TWO_FACTOR_AUTH_INPUT_TIMEOUT_SECONDS}
        onTimerEnd={onCountDownEnd}
        options={{
          progressBarType: "linear",
        }}
        className="w-full text-center text-lg"
      />
    </div>
  );
};

export default TwoFactorAuthenticationTimer;
