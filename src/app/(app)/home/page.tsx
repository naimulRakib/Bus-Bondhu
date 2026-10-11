"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PackagePlus,
  ShieldCheck,
  Package,
  History,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useShipmentStore } from "@/lib/store/shipment-store";
import { useI18n } from "@/lib/i18n/context";
import { ShipmentCard } from "@/components/shipment/ShipmentCard";

export default function MerchantHomePage() {
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);
  const shipments = useShipmentStore((s) => s.shipments);
  const [tab, setTab] = useState<"active" | "history">("active");

  const merchantShipments = shipments.filter(
    (s) => !user || s.merchantId === user.id
  );

  const activeShipments = merchantShipments.filter(
    (s) => s.status !== "collected_closed" && s.status !== "claim_filed"
  );

  const historyShipments = merchantShipments.filter(
    (s) => s.status === "collected_closed" || s.status === "claim_filed"
  );

  const displayedList = tab === "active" ? activeShipments : historyShipments;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome & Merchant Profile Card */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{t("home.greeting")}</span>
            <span>·</span>
            <span className="text-blue-600 font-bold">{user?.name || "Merchant"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {user?.businessName || "BusBondhu Merchant Portal"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilot Partner · Verified Route: Dhaka ↔ Cumilla</span>
          </p>
        </div>

        <Link
          href="/book"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <PackagePlus className="w-4 h-4" />
          <span>{t("home.quickBook")}</span>
        </Link>
      </section>

      {/* Tabs & List */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                tab === "active"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{t("home.activeShipments")}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  tab === "active"
                    ? "bg-slate-800 text-slate-200"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {activeShipments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTab("history")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                tab === "history"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{t("home.history")}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  tab === "history"
                    ? "bg-slate-800 text-slate-200"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {historyShipments.length}
              </span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Press &apos;D&apos; to simulate bus scans
          </span>
        </div>

        {/* Shipment Cards List using ShipmentCard */}
        {displayedList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center gap-2 text-slate-500">
            <Package className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-medium">
              {tab === "active" ? t("home.noActive") : t("home.noHistory")}
            </p>
            {tab === "active" && (
              <Link
                href="/book"
                className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
              >
                + Book a parcel on the next departure
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {displayedList.map((shipment) => (
              <ShipmentCard key={shipment.id} shipment={shipment} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
