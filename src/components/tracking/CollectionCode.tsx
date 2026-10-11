"use client";

import React, { useState } from "react";
import { KeyRound, Lock, Copy, Check, ShieldCheck } from "lucide-react";
import { ShipmentStatus } from "@/lib/types";

interface CollectionCodeProps {
  code: string;
  status: ShipmentStatus;
}

export function CollectionCode({ code, status }: CollectionCodeProps) {
  const [copied, setCopied] = useState(false);

  const isReady =
    status === "receiver_notified" || status === "collected_closed";

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isReady
          ? "bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-lg"
          : "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <KeyRound className="w-4 h-4" />
          <span>Secret Counter Collection Code</span>
        </span>

        {isReady ? (
          <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Ready for Pickup</span>
          </span>
        ) : (
          <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Unlocks Upon Counter Arrival</span>
          </span>
        )}
      </div>

      {isReady ? (
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex items-center gap-3">
            <div className="font-mono text-4xl sm:text-5xl font-black tracking-widest bg-white/10 px-6 py-2 rounded-2xl border border-white/20 shadow-inner">
              {code}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-200" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-emerald-100 text-center max-w-sm mt-1">
            Present this 6-digit code to the counter officer. Do not share with unknown parties.
          </p>
        </div>
      ) : (
        <div className="text-center py-4 flex flex-col items-center gap-1 text-slate-600">
          <div className="font-mono text-2xl tracking-widest font-extrabold text-slate-400">
            • • • • • •
          </div>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            Your pickup code will automatically unlock here as soon as the bus supervisor scans and unloads the parcel at the counter.
          </p>
        </div>
      )}
    </div>
  );
}
