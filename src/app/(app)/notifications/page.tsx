"use client";

import React, { useState } from "react";
import { Search, CheckCheck } from "lucide-react";
import { useNotificationStore } from "@/lib/store/notification-store";
import { NotificationList } from "@/components/notifications/NotificationList";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<"all" | "receiver" | "merchant">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "receiver" && notif.recipientRole !== "receiver") return false;
    if (activeTab === "merchant" && notif.recipientRole !== "merchant") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        notif.message.toLowerCase().includes(q) ||
        notif.title.toLowerCase().includes(q) ||
        notif.shipmentId.toLowerCase().includes(q) ||
        notif.recipientPhone.includes(q)
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-950">
              Alerts & Simulated SMS Dispatches
            </h1>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit log of all programmatic SMS messages dispatched to merchants & receivers
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            All Dispatches ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("receiver")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "receiver"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Receiver SMS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("merchant")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "merchant"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Merchant Alerts
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SMS / shipment..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white text-slate-900"
          />
        </div>
      </div>

      {/* Notification List */}
      <NotificationList
        notifications={filteredNotifications}
        onMarkRead={markAsRead}
      />
    </div>
  );
}
