"use client";

import React from "react";
import { Counter } from "@/lib/types";
import { Building, MapPin, Clock, Phone } from "lucide-react";

interface CounterInfoProps {
  counter: Counter;
}

export function CounterInfo({ counter }: CounterInfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-blue-600" />
          <span>Designated Destination Counter</span>
        </h3>
        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {counter.operatorName}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-extrabold text-base text-slate-900">
          {counter.name}
        </h4>

        <div className="space-y-1.5 text-xs text-slate-600">
          <p className="flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span className="font-medium">{counter.address}</span>
          </p>

          <p className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Operating Hours: <strong>{counter.hours}</strong></span>
          </p>

          {counter.phone && (
            <p className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Counter Helpdesk: <strong>{counter.phone}</strong></span>
            </p>
          )}
        </div>
      </div>

      {/* Simulated Map Placeholder with Interactive Look */}
      <div className="w-full h-32 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center text-slate-500 gap-1.5">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md z-10 animate-pulse">
          <MapPin className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-slate-700 z-10">
          {counter.name.split("–")[1]?.trim() || "Terminal Location"}
        </span>
        <span className="text-[10px] text-slate-400 z-10">
          Interactive Counter Map Placeholder
        </span>
      </div>
    </div>
  );
}
