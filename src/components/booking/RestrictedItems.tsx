"use client";

import React from "react";
import { AlertOctagon, CheckSquare, Square, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface RestrictedItemsProps {
  acknowledged: boolean;
  onToggleAcknowledged: (checked: boolean) => void;
  error?: string;
}

export function RestrictedItems({
  acknowledged,
  onToggleAcknowledged,
  error,
}: RestrictedItemsProps) {
  const restrictedList = [
    "No unpadded glass, ceramics or delicate fragile items",
    "No liquids, chemicals, corrosive fluids or oils",
    "No flammable, compressed gas, battery packs or dangerous goods",
    "No cash, gold, precious jewelry or goods valued over Tk 5,000",
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-rose-700">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <h4 className="text-xs font-bold uppercase tracking-wider">
          Pilot Safety Rules & Prohibited Items
        </h4>
      </div>

      <p className="text-xs text-slate-600 leading-snug">
        BusBondhu Express pilot corridor strictly handles <strong>clothing, fabrics, and ready-made retail goods</strong>. The following are strictly excluded:
      </p>

      <ul className="space-y-1.5 pl-1">
        {restrictedList.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-[11px] text-slate-700"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Mandatory Checkbox */}
      <div
        onClick={() => onToggleAcknowledged(!acknowledged)}
        className={cn(
          "p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-2.5 mt-1",
          acknowledged
            ? "bg-blue-50/80 border-blue-400 text-blue-900"
            : error
            ? "bg-rose-50 border-rose-300 text-rose-900"
            : "bg-white border-slate-300 hover:border-slate-400 text-slate-800"
        )}
      >
        {acknowledged ? (
          <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
        ) : (
          <Square className="w-4 h-4 text-slate-400 shrink-0" />
        )}
        <span className="text-xs font-semibold leading-tight select-none">
          I certify this parcel contains only clothing/textiles and no prohibited or hazardous items.
        </span>
      </div>

      {error && (
        <span className="text-[11px] text-rose-600 font-medium">{error}</span>
      )}
    </div>
  );
}
