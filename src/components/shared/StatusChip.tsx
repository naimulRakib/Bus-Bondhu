"use client";

import { ShipmentStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/data/constants";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface StatusChipProps {
  status: ShipmentStatus;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const { locale } = useI18n();
  const info = STATUS_LABELS[status] || {
    en: status,
    bn: status,
    variant: "blue",
  };

  const label = locale === "bn" ? info.bn : info.en;

  const variantStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    teal: "bg-emerald-50 text-emerald-800 border-emerald-200",
    orange: "bg-orange-50 text-orange-800 border-orange-200",
    red: "bg-rose-50 text-rose-800 border-rose-200",
  }[info.variant];

  const dotStyles = {
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    teal: "bg-emerald-500",
    orange: "bg-orange-500",
    red: "bg-rose-500 animate-pulse",
  }[info.variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border select-none transition-colors",
        variantStyles,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles)} />
      <span>{label}</span>
    </span>
  );
}
