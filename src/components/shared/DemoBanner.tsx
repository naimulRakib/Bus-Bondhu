"use client";

import { AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function DemoBanner() {
  const { t } = useI18n();

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-slate-900 text-slate-200 text-xs py-1.5 px-4 flex items-center justify-center gap-2 border-b border-slate-800 tracking-wide select-none z-40"
    >
      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span className="text-center font-medium">
        {t("app.disclaimer")}
      </span>
    </div>
  );
}
