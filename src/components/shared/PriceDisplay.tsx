"use client";

import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({ amount, className, size = "md" }: PriceDisplayProps) {
  const { locale, t } = useI18n();

  const formattedAmount =
    locale === "bn"
      ? amount.toLocaleString("bn-BD")
      : amount.toString();

  const currencySymbol = locale === "bn" ? "৳" : "Tk";

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base font-semibold",
    lg: "text-2xl font-bold tracking-tight",
  }[size];

  return (
    <div className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className={cn("text-slate-900 font-sans", sizeStyles)}>
        {currencySymbol} {formattedAmount}
      </span>
      <span className="text-[10px] uppercase font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded tracking-wider border border-slate-200">
        {t("common.indicative")}
      </span>
    </div>
  );
}
