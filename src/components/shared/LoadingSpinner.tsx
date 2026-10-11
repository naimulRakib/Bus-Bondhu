"use client";

import React from "react";
import { Bus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  label = "Loading verified departure data...",
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 gap-3 text-slate-500",
        className
      )}
    >
      <div className="relative flex items-center justify-center w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
          <Bus className="w-4 h-4 animate-pulse" />
        </div>
      </div>
      {label && <p className="text-xs font-semibold text-slate-600">{label}</p>}
    </div>
  );
}
