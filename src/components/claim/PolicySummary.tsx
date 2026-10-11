"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { MAX_CLAIM_COMPENSATION } from "@/lib/data/constants";

export function PolicySummary() {
  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col gap-2.5 text-xs">
      <div className="flex items-center gap-2 text-amber-950 font-bold">
        <ShieldCheck className="w-4 h-4 text-amber-600" />
        <span>Honest Pilot Policy &amp; Compensation Cap</span>
      </div>

      <div className="text-amber-900 text-[11px] leading-relaxed">
        Under the Ideathon pilot proposal, verified claims receive reimbursement capped at{" "}
        <strong>Tk {MAX_CLAIM_COMPENSATION}</strong> per parcel. High-value jewelry or cash over Tk 5,000 are not eligible.
      </div>

      <div className="pt-2 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-white/60 rounded-lg p-2 border border-amber-100">
          <span className="text-slate-400 block text-[9px] uppercase font-bold">
            Traditional Bus Parcels
          </span>
          <span className="font-semibold text-rose-700">
            Tk 0 compensation, zero records
          </span>
        </div>
        <div className="bg-white/60 rounded-lg p-2 border border-amber-100">
          <span className="text-slate-400 block text-[9px] uppercase font-bold">
            BusBondhu Express Pilot
          </span>
          <span className="font-semibold text-emerald-700">
            Up to Tk 2,000 + 24h audit SLA
          </span>
        </div>
      </div>
    </div>
  );
}
