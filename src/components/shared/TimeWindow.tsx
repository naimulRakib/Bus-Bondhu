"use client";

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeWindowProps {
  earliest: string;
  latest: string;
  isDelayed?: boolean;
  className?: string;
}

export function TimeWindow({
  earliest,
  latest,
  isDelayed = false,
  className,
}: TimeWindowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        isDelayed ? "text-amber-700 font-semibold" : "text-slate-700",
        className
      )}
    >
      <Clock
        className={cn(
          "w-3.5 h-3.5 shrink-0",
          isDelayed ? "text-amber-500 animate-spin" : "text-slate-400"
        )}
      />
      <span>
        Est: <strong>{earliest} – {latest}</strong>
      </span>
      {isDelayed && (
        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
          delayed
        </span>
      )}
    </div>
  );
}
