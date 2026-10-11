"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { HandoverEvent, ShipmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReceiverTimelineProps {
  events: HandoverEvent[];
  status?: ShipmentStatus;
}

export function ReceiverTimeline({ events }: ReceiverTimelineProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Live Parcel Handover Milestones
      </h3>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((evt, idx) => {
          const isLatest = idx === events.length - 1;
          const isAlert = evt.type === "delay_alert" || evt.type === "missing_scan_alert";

          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="relative text-xs"
            >
              <span
                className={cn(
                  "absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white",
                  isAlert
                    ? "bg-amber-500 ring-2 ring-amber-200"
                    : isLatest
                    ? "bg-blue-600 ring-4 ring-blue-100 animate-pulse"
                    : "bg-emerald-500"
                )}
              />

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900">{evt.note}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{evt.location}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
