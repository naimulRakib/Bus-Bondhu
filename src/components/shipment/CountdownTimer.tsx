"use client";

import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { ShipmentStatus } from "@/lib/types";

import { useCountdown } from "@/lib/hooks/use-countdown";

interface CountdownTimerProps {
  cutoffTime: string;
  status: ShipmentStatus;
}

export function CountdownTimer({ cutoffTime, status }: CountdownTimerProps) {
  const countdown = useCountdown(cutoffTime);
  const isPastAccepted = status !== "booked";

  if (isPastAccepted) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Drop-off cutoff met ({cutoffTime})</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold animate-pulse">
      <Clock className="w-3.5 h-3.5 text-amber-600" />
      <span>
        Drop-off cutoff: {cutoffTime} ({countdown.isPast ? "Cutoff reached" : `${countdown.formatted} left`})
      </span>
    </div>
  );
}
