"use client";

import React from "react";
import { ClaimType } from "@/lib/types";

interface ClaimTypeSelectProps {
  value: ClaimType;
  onChange: (type: ClaimType) => void;
}

const CLAIM_OPTIONS: Array<{
  id: ClaimType;
  label: string;
  desc: string;
}> = [
  {
    id: "delay",
    label: "Excessive Transit Delay",
    desc: "Bus arrived > 60 mins past estimated window",
  },
  {
    id: "missing",
    label: "Missing Destination Scan",
    desc: "Departed origin but unlogged at destination",
  },
  {
    id: "damaged",
    label: "Damaged / Broken Package",
    desc: "Physical carton crushed or seal broken",
  },
  {
    id: "wrong_handover",
    label: "Wrong Counter Delivery",
    desc: "Offloaded at non-designated bus counter",
  },
];

export function ClaimTypeSelect({ value, onChange }: ClaimTypeSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-700">
        1. Select Issue Category
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {CLAIM_OPTIONS.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
              value === item.id
                ? "border-blue-600 bg-blue-50/80 text-blue-950 ring-1 ring-blue-500"
                : "border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            <span className="font-bold text-xs">{item.label}</span>
            <span className="text-[11px] text-slate-500">{item.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
