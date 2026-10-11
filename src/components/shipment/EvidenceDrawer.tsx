"use client";

import React from "react";
import { HandoverEvent } from "@/lib/types";
import { X, ShieldCheck, MapPin, Clock, UserCheck, FileText } from "lucide-react";

interface EvidenceDrawerProps {
  event: HandoverEvent | null;
  onClose: () => void;
}

export function EvidenceDrawer({ event, onClose }: EvidenceDrawerProps) {
  if (!event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Custody Handover Record
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Log ID: {event.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 text-xs">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-2.5">
            <UserCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400">Verifying Actor & Role</div>
              <div className="font-bold text-slate-900">{event.actor.name}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Role: {event.actor.role.replace("_", " ")}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400">Handover Location</div>
              <div className="font-bold text-slate-900">{event.location}</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400">Timestamp (Bangladesh Standard Time)</div>
              <div className="font-mono font-semibold text-slate-900">
                {new Date(event.timestamp).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400">Physical Condition & Log Notes</div>
              <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">
                {event.note}
              </p>
              {event.condition && (
                <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md p-1.5 font-semibold">
                  Inspection: {event.condition}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}
