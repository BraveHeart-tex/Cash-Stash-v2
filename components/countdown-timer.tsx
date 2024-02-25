"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ICountDownTimerProps {
  timer: number;
  onTimerEnd?: () => void;
  options?: {
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
  };
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

  const renderContent = () => {
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

    return <div className={cn("font-mono", className)}>{parts.join(":")}</div>;
  };

  return <div>{renderContent()}</div>;
};

export default CountDownTimer;
