"use client";
import CountDownTimer from "@/components/countdown-timer";
import {
  EMAIL_VERIFICATION_REDIRECTION_PATHS,
  PAGE_ROUTES,
  TWO_FACTOR_AUTH_INPUT_TIMEOUT_SECONDS,
} from "@/lib/constants";
import { redirect } from "next/navigation";
import { showErrorToast } from "@/components/ui/use-toast";

const TwoFactorAuthenticationTimer = () => {
  const onCountDownEnd = () => {
    showErrorToast("Verification timeout. Please try logging in again.");
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
