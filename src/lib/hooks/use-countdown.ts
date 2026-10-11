"use client";

import { useState, useEffect } from "react";

export interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  formatted: string;
}

/**
 * Hook to calculate and countdown remaining time until a departure cutoff.
 */
export function useCountdown(targetTimeStr: string): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>(() =>
    calculateTimeLeft(targetTimeStr)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTimeStr));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTimeStr]);

  return timeLeft;
}

function calculateTimeLeft(timeStr: string): CountdownResult {
  const now = new Date();
  const [time, modifier] = timeStr.trim().split(" ");
  const timeParts = time.split(":").map(Number);
  let hours = timeParts[0];
  const minutes = timeParts[1];

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      formatted: "Cutoff passed",
    };
  }

  const h = Math.floor(diffMs / (1000 * 60 * 60));
  const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diffMs % (1000 * 60)) / 1000);

  return {
    hours: h,
    minutes: m,
    seconds: s,
    isPast: false,
    formatted: `${h > 0 ? `${h}h ` : ""}${m}m ${s}s`,
  };
}
