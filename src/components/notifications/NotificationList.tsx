"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  ExternalLink,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { Notification } from "@/lib/types";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn } from "@/lib/utils";

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
}

export function NotificationList({
  notifications,
  onMarkRead,
}: NotificationListProps) {
  const { setActiveSmsModal } = useDemoStore();

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center gap-2 text-slate-500">
        <Bell className="w-8 h-8 text-slate-300" />
        <p className="text-xs font-semibold text-slate-700">No matching SMS messages found</p>
        <p className="text-[11px] text-slate-400">
          Use the Demo Controls (Hotkey D) to advance stages or trigger events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          onClick={() => onMarkRead(notif.id)}
          className={cn(
            "p-4 rounded-2xl border transition-all flex flex-col gap-2.5",
            notif.read
              ? "bg-white border-slate-200 text-slate-700"
              : "bg-blue-50/50 border-blue-200 text-slate-900 shadow-xs ring-1 ring-blue-100"
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              )}
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>{notif.title}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                To: {notif.recipientRole} ({notif.recipientPhone})
              </span>
            </div>

            <span className="text-[10px] text-slate-400 font-mono shrink-0">
              {new Date(notif.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Message text styled like SMS terminal */}
          <div className="bg-slate-900 text-emerald-400 rounded-xl p-3 text-xs font-mono leading-relaxed shadow-inner border border-slate-800 flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-sans">
                SMS Gateway Dispatch [Simulated]
              </div>
              <p className="text-slate-100 whitespace-pre-wrap">{notif.message}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSmsModal(notif);
              }}
              className="inline-flex items-center gap-1.5 text-purple-700 hover:text-purple-900 font-semibold cursor-pointer text-[11px] bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors border border-purple-200"
            >
              <Smartphone className="w-3 h-3" />
              <span>Preview as Phone Screen</span>
            </button>

            <Link
              href={`/shipment/${notif.shipmentId}`}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-[11px]"
            >
              <span>Parcel {notif.shipmentId}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
