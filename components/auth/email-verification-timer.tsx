"use client";
import { redirect } from "next/navigation";
import CountDownTimer from "@/components/countdown-timer";
import { PAGE_ROUTES } from "@/lib/constants";
import { showErrorToast } from "@/components/ui/use-toast";

const EmailVerificationTimer = ({ time }: { time: number }) => {
  return (
    <CountDownTimer
      countDownFrom={5 * 60}
      className="mt-2 w-full text-center text-2xl"
      timer={time}
      options={{
        progressBarType: "linear",
      }}
      onTimerEnd={() => {
        // TODO: Handle verification time end
        showErrorToast(
          "Verification time expired",
          "Please request a new verification code."
        );
        redirect(PAGE_ROUTES.LOGIN_ROUTE + "?error=verification-timeout");
      }}
    />
  );
};
export default EmailVerificationTimer;
