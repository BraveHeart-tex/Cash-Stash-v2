"use client";
import { redirect } from "next/navigation";
import CountDownTimer from "@/components/countdown-timer";
import { PAGE_ROUTES } from "@/lib/constants";

const EmailVerificationTimer = () => {
  return (
    <CountDownTimer
      className="mt-2 w-full text-center text-2xl"
      timer={298}
      options={{
        progressBarType: "linear",
      }}
      onTimerEnd={() => {
        redirect(PAGE_ROUTES.LOGIN_ROUTE + "?error=verification-timeout");
      }}
    />
  );
};
export default EmailVerificationTimer;
