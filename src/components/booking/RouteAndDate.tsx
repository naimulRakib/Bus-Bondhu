"use client";

import React from "react";
import { SEED_ROUTES } from "@/lib/data/seed";
import { MapPin, Calendar, Lock, CheckCircle2, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteAndDateProps {
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

// Compute date strings at module level
const TODAY_STR = new Date().toISOString().split("T")[0];
const TOMORROW_STR = new Date(new Date().setDate(new Date().getDate() + 1))
  .toISOString()
  .split("T")[0];

export function RouteAndDate({
  selectedRouteId,
  onSelectRoute,
  selectedDate,
  onSelectDate,
}: RouteAndDateProps) {
  const activeRoute =
    SEED_ROUTES.find((r) => r.id === selectedRouteId) || SEED_ROUTES[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Route Selector */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-800">
          Select Pilot Dispatch Corridor
        </label>

        <div className="grid grid-cols-1 gap-2.5">
          {SEED_ROUTES.map((route) => {
            const isSelected = selectedRouteId === route.id;
            const isAvailable = route.isActive;

            return (
              <div
                key={route.id}
                onClick={() => {
                  if (isAvailable) onSelectRoute(route.id);
                }}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left relative",
                  !isAvailable
                    ? "opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed"
                    : isSelected
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100 shadow-xs cursor-pointer"
                    : "border-slate-200 hover:border-slate-300 bg-white cursor-pointer"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {route.origin} → {route.destination}
                      </span>
                      {isAvailable ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active Pilot Corridor
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Coming Soon</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Origin: {route.originCounter.name} · Destination: {route.destinationCounter.name}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 hidden sm:block shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-800">
          Choose Dispatch Date
        </label>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            type="button"
            onClick={() => onSelectDate(TODAY_STR)}
            className={cn(
              "p-3 rounded-xl border-2 text-left font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer",
              selectedDate === TODAY_STR
                ? "border-blue-600 bg-blue-50 text-blue-900 shadow-xs"
                : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
            )}
          >
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div>Today</div>
              <div className="text-[10px] text-slate-500 font-normal">{TODAY_STR}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectDate(TOMORROW_STR)}
            className={cn(
              "p-3 rounded-xl border-2 text-left font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer",
              selectedDate === TOMORROW_STR
                ? "border-blue-600 bg-blue-50 text-blue-900 shadow-xs"
                : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
            )}
          >
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div>Tomorrow</div>
              <div className="text-[10px] text-slate-500 font-normal">{TOMORROW_STR}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Counter Location Notes */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-2.5">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-slate-500" />
          <span>Designated Pilot Terminals</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-[10px] text-slate-400">Origin Counter (Drop-off)</div>
            <div className="font-semibold text-slate-800">{activeRoute.originCounter.name}</div>
            <div className="text-[11px] text-slate-500">{activeRoute.originCounter.address}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Destination Counter (Pickup)</div>
            <div className="font-semibold text-slate-800">{activeRoute.destinationCounter.name}</div>
            <div className="text-[11px] text-slate-500">{activeRoute.destinationCounter.address}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
