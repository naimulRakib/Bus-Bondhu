"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MapPin,
  AlertTriangle,
  FileQuestion,
  Eye,
} from "lucide-react";
import { HandoverEvent, ShipmentStatus } from "@/lib/types";
import { EvidenceDrawer } from "./EvidenceDrawer";
import { cn } from "@/lib/utils";

interface TimelineProps {
  events: HandoverEvent[];
  currentStatus?: ShipmentStatus;
}

export function Timeline({ events }: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<HandoverEvent | null>(null);

  const getEventIcon = (type: string, isLatest: boolean) => {
    if (type === "delay_alert") {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
    if (type === "missing_scan_alert" || type === "damaged_alert") {
      return <FileQuestion className="w-4 h-4 text-rose-500" />;
    }
    if (isLatest) {
      return <CheckCircle2 className="w-4 h-4 text-blue-600 animate-pulse" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative pl-6 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {events.map((event, index) => {
          const isLatest = index === events.length - 1;
          const isException =
            event.type === "delay_alert" ||
            event.type === "missing_scan_alert" ||
            event.type === "damaged_alert";

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className={cn(
                "relative rounded-xl p-3.5 border transition-all",
                isException
                  ? "bg-rose-50/70 border-rose-200 shadow-xs"
                  : isLatest
                  ? "bg-blue-50/50 border-blue-200 shadow-xs ring-1 ring-blue-100"
                  : "bg-white border-slate-200"
              )}
            >
              {/* Timeline Bullet Node */}
              <span
                className={cn(
                  "absolute -left-6 top-4 w-6 h-6 rounded-full bg-white border flex items-center justify-center -translate-x-1/2 shadow-xs",
                  isException
                    ? "border-rose-400 bg-rose-50"
                    : isLatest
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-emerald-400"
                )}
              >
                {getEventIcon(event.type, isLatest)}
              </span>

              {/* Event Content */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs text-slate-900">
                      {event.actor.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      {event.actor.role.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(event.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-snug">
                  {event.note}
                </p>

                {event.condition && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5 font-semibold self-start">
                    Condition: {event.condition}
                  </div>
                )}

                {/* Location & Evidence Drawer Link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 truncate max-w-[65%]">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer text-[10px] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Evidence</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide-over Evidence Drawer */}
      <EvidenceDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
