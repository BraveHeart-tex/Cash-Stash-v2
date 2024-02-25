"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type ICountDownTimerOptions = {
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  progressBarType: "linear" | "circular";
};

interface ICountDownTimerProps {
  timer: number;
  onTimerEnd?: () => void;
  options?: Partial<ICountDownTimerOptions>;
  className?: string;
}

const CountDownTimer = ({
  timer,
  onTimerEnd,
  options = {
    showHours: false,
    showMinutes: true,
    showSeconds: true,
  },
  className,
}: ICountDownTimerProps) => {
  const [time, setTime] = useState(timer);

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

    if (options?.showHours) {
      parts.push(formattedHours);
    }

    if (options?.showMinutes) {
      parts.push(formattedMinutes);
    }

    if (options?.showSeconds) {
      parts.push(formattedSeconds);
    }

    const content = (
      <div className={cn("font-mono", className)}>{parts.join(":")}</div>
    );

    if (options?.progressBarType === "linear") {
      return (
        <>
          {content}
          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-primary rounded-full animate-pulse"
              style={{
                width: `${(time / timer) * 100}%`,
              }}
            ></div>
          </div>
        </>
      );
    }

    if (options?.progressBarType === "circular") {
      return (
        <div className="relative w-20 h-20 mt-1">
          <svg
            className="absolute w-full h-full"
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
              strokeDashoffset={100 - (time / timer) * 100}
              fill="none"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            {content}
          </div>
        </div>
      );
    }

    return null;
  };

  return <div>{renderContentAndProgressBar()}</div>;
};

export default CountDownTimer;
