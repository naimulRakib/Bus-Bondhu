"use client";

import React from "react";
import { SEED_DEPARTURES } from "@/lib/data/seed";
import { Clock, Bus, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepartureSelectProps {
  routeId: string;
  date: string;
  selectedDepartureId: string;
  onSelectDeparture: (departureId: string) => void;
}

export function DepartureSelect({
  routeId,
  date,
  selectedDepartureId,
  onSelectDeparture,
}: DepartureSelectProps) {
  // Filter departures matching route and date (or fallback to route departures)
  const availableDepartures = SEED_DEPARTURES.filter(
    (dep) => dep.routeId === routeId && dep.date === date
  );

  const departuresToDisplay =
    availableDepartures.length > 0
      ? availableDepartures
      : SEED_DEPARTURES.filter((dep) => dep.routeId === routeId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
        <div>
          <h3 className="text-xs font-bold text-slate-800">
            Available Confirmed Departures
          </h3>
          <p className="text-[11px] text-slate-500">
            Parcels must be dropped at origin counter before the cutoff time.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Boot Capacity Guaranteed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {departuresToDisplay.map((dep, index) => {
          const isSelected = selectedDepartureId === dep.id;
          // For demo realism, mark the earliest 8:00 AM departure as cutoff passed if date is today
          const isCutoffPassed = index === 0 && dep.cutoffTime === "07:30 AM";

          return (
            <div
              key={dep.id}
              onClick={() => {
                if (!isCutoffPassed) onSelectDeparture(dep.id);
              }}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col gap-3 text-left relative",
                isCutoffPassed
                  ? "opacity-50 bg-slate-100 border-slate-200 cursor-not-allowed"
                  : isSelected
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100 shadow-xs cursor-pointer"
                  : "border-slate-200 hover:border-slate-300 bg-white cursor-pointer"
              )}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      isCutoffPassed
                        ? "bg-slate-200 text-slate-500"
                        : isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600"
                    )}
                  >
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {dep.departureTime} Departure
                      </span>
                      {dep.capacityConfirmed && !isCutoffPassed && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Capacity Confirmed
                        </span>
                      )}
                      {isCutoffPassed && (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                          Cutoff Passed
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {dep.operatorName} · {dep.busIdentifier}
                    </div>
                  </div>
                </div>

                {isSelected && !isCutoffPassed && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                )}
              </div>

              {/* Time Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Counter Cutoff</div>
                  <div className="font-semibold text-rose-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-600" />
                    <span>{dep.cutoffTime}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400">Est. Ready Window</div>
                  <div className="font-semibold text-slate-800">
                    {dep.estimatedArrivalWindow.earliest} – {dep.estimatedArrivalWindow.latest}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400">Routing</div>
                  <div className="font-medium text-slate-700 truncate">
                    {dep.originCounter.name.split("–")[1]?.trim()} → {dep.destinationCounter.name.split("–")[1]?.trim()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
