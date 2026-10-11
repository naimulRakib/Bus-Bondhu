"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  stepLabels,
}: StepIndicatorProps) {
  return (
    <div className="w-full mb-6">
      {/* Step Numbers & Labels */}
      <div className="flex items-center justify-between relative">
        {/* Progress connecting line */}
        <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute top-3.5 left-4 h-0.5 bg-blue-600 transition-all duration-300 -z-0"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />

        {stepLabels.map((label, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={label} className="flex flex-col items-center z-10">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2",
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isCurrent
                    ? "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100"
                    : "bg-white border-slate-300 text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNumber}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1.5 font-medium hidden sm:block text-center max-w-[70px] truncate",
                  isCurrent ? "text-blue-600 font-bold" : "text-slate-500"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Title */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-xs font-bold text-slate-900">
          Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
        </span>
      </div>
    </div>
  );
}
