"use client";

import React from "react";
import {
  TrendingUp,
  X,
  DollarSign,
  ShieldAlert,
  Percent,
  Building2,
  Bus,
} from "lucide-react";
import { useDemoStore } from "@/lib/store/demo-store";

export function InvestorLensModal() {
  const { isInvestorLensOpen, setInvestorLensOpen } = useDemoStore();

  if (!isInvestorLensOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="investor-lens-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setInvestorLensOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  Ideathon 2026 Pitch Lens
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Asset-Light Dispatch Layer
                </span>
              </div>
              <h2 id="investor-lens-title" className="text-base sm:text-lg font-bold text-white mt-1">
                BusBondhu Express: Unit Economics &amp; TAM
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Monetizing existing intercity bus luggage boots without fleet or vehicle CapEx.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setInvestorLensOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Investor Lens"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Platform Take-Rate
              </span>
              <span className="text-xl font-extrabold text-purple-900 font-mono mt-0.5 block">
                42.3%
              </span>
              <span className="text-[10px] text-slate-500">Tk 55 on Tk 130 parcel</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Net Contribution
              </span>
              <span className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5 block">
                Tk 40
              </span>
              <span className="text-[10px] text-slate-500">Post-escrow &amp; SMS</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Fleet CapEx
              </span>
              <span className="text-xl font-extrabold text-blue-600 font-mono mt-0.5 block">
                Tk 0
              </span>
              <span className="text-[10px] text-slate-500">Zero vehicle ownership</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Pilot Corridor TAM
              </span>
              <span className="text-xl font-extrabold text-amber-600 font-mono mt-0.5 block">
                3,750/d
              </span>
              <span className="text-[10px] text-slate-500">Dhaka ↔ Cumilla boots</span>
            </div>
          </div>

          {/* Unit Economics Waterfall (Tk 130 Medium Band) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-xs">
                  Unit Economics Waterfall: Standard Medium Parcel (Tk 130)
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600">
                100% of GMV
              </span>
            </div>

            {/* Visual Stacked Bar */}
            <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: "15.4%" }}
                className="bg-blue-500"
                title="Origin Counter (Tk 20 / 15.4%)"
              />
              <div
                style={{ width: "26.9%" }}
                className="bg-indigo-600"
                title="Bus Boot Operator (Tk 35 / 26.9%)"
              />
              <div
                style={{ width: "15.4%" }}
                className="bg-sky-400"
                title="Destination Counter (Tk 20 / 15.4%)"
              />
              <div
                style={{ width: "11.5%" }}
                className="bg-amber-400"
                title="Custody Escrow & SMS (Tk 15 / 11.5%)"
              />
              <div
                style={{ width: "30.8%" }}
                className="bg-emerald-500"
                title="Net BusBondhu Profit (Tk 40 / 30.8%)"
              />
            </div>

            {/* Breakdown Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Origin Counter Intake Fee</span>
                </span>
                <span className="font-mono font-bold text-slate-900">Tk 20</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                  <span>Bus Luggage Boot Space Fee</span>
                </span>
                <span className="font-mono font-bold text-slate-900">Tk 35</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                  <span>Destination Counter Release Fee</span>
                </span>
                <span className="font-mono font-bold text-slate-900">Tk 20</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Insurance Escrow &amp; SMS Cost</span>
                </span>
                <span className="font-mono font-bold text-slate-900">Tk 15</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-950 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Net BusBondhu Platform Contribution</span>
              </span>
              <span className="font-mono text-sm text-emerald-800">
                Tk 40 / parcel (30.8% Net Margin)
              </span>
            </div>
          </div>

          {/* Three Strategic Flywheels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Counter Clerk Incentive</h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                Clerks earn Tk 40/parcel roundtrip. Handling 30 parcels/day yields Tk 1,200 incremental income on zero capital investment.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Bus className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Boot Space Monetization</h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                Bus luggage boots run 70% empty on intercity routes. Bus operators earn Tk 500+ extra per run without passenger friction.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Fraud Arbitrage</h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                The secret 6-digit receiver pickup code eliminates wrongful pickups. The Tk 15 escrow covers the Tk 2k cap at up to 0.75% failure.
              </p>
            </div>
          </div>

          {/* Realistic Pilot Projection */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-950 font-bold">
              <Percent className="w-4 h-4 text-indigo-600" />
              <span>Pilot Financial Model: Dhaka ↔ Cumilla (10% Market Share)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/80 rounded-xl p-2.5 border border-indigo-100">
                <div className="text-[10px] text-slate-500 font-semibold">Daily Volume</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">375 parcels/day</div>
              </div>
              <div className="bg-white/80 rounded-xl p-2.5 border border-indigo-100">
                <div className="text-[10px] text-slate-500 font-semibold">Monthly GMV</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">Tk 14.6 Lac (~$13k)</div>
              </div>
              <div className="bg-white/80 rounded-xl p-2.5 border border-indigo-100">
                <div className="text-[10px] text-slate-500 font-semibold">Monthly Net Contribution</div>
                <div className="font-mono font-bold text-emerald-700 mt-0.5">Tk 4.5 Lac (~$4.1k)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            BusBondhu Express • Ideathon Bangladesh 2026 Pitch Prototype
          </span>
          <button
            type="button"
            onClick={() => setInvestorLensOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer"
          >
            Close Pitch Lens
          </button>
        </div>
      </div>
    </div>
  );
}
