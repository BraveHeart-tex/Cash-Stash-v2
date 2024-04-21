"use client";
import { cn } from "@/lib/utils/stringUtils/cn";
import { useEffect, useState } from "react";

type CountDownTimerOptions = {
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  progressBarType: "linear" | "circular";
};

type CountDownTimerProps = {
  countDownFrom: number;
  timer: number;
  onTimerEnd?: () => void;
  options?: Partial<CountDownTimerOptions>;
  className?: string;
};

const CountDownTimer = ({
  timer,
  onTimerEnd,
  options,
  className,
  countDownFrom,
}: CountDownTimerProps) => {
  const [time, setTime] = useState(timer);
  const timerOptions: Partial<CountDownTimerOptions> = {
    showHours: false,
    showMinutes: true,
    showSeconds: true,
    ...options,
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (time > 0) {
      timeoutId = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      onTimerEnd && onTimerEnd();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [time, onTimerEnd]);

  // Calculate minutes and seconds
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Format minutes and seconds with leading zero if needed
  const formattedHours = Math.floor(minutes / 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const renderContentAndProgressBar = () => {
    const parts = [];

    if (timerOptions?.showHours) {
      parts.push(formattedHours);
    }

    if (timerOptions?.showMinutes) {
      parts.push(formattedMinutes);
    }

    if (timerOptions?.showSeconds) {
      parts.push(formattedSeconds);
    }

    const content = (
      <div className={cn("font-mono", className)}>{parts.join(":")}</div>
    );

    if (timerOptions?.progressBarType === "linear") {
      return (
        <>
          {content}
          <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${(time / countDownFrom) * 100}%`,
              }}
            ></div>
          </div>
        </>
      );
    }

    if (timerOptions?.progressBarType === "circular") {
      return (
        <div className="relative mt-1 h-20 w-20">
          <svg
            className="absolute h-full w-full"
            viewBox="0 0 36 36"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle
              className="stroke-current text-primary"
              cx="18"
              cy="18"
              r="16"
              strokeWidth="4"
              strokeDasharray="100, 100"
              strokeDashoffset={100 - (time / countDownFrom) * 100}
              fill="none"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            {content}
          </div>
        </div>
      );
    }

    return (
      <div className="font-mono text-2xl text-primary">{parts.join(":")}</div>
    );
  };

  return <div>{renderContentAndProgressBar()}</div>;
};

export default CountDownTimer;
