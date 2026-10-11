"use client";

import React from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { Shipment } from "@/lib/types";
import { StatusChip } from "@/components/shared/StatusChip";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

interface ShipmentCardProps {
  shipment: Shipment;
}

export function ShipmentCard({ shipment }: ShipmentCardProps) {
  const lastEvent =
    shipment.events.length > 0
      ? shipment.events[shipment.events.length - 1]
      : null;

  return (
    <Link
      href={`/shipment/${shipment.id}`}
      className="bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200 p-4 shadow-xs transition-all flex flex-col gap-3 group"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-900">
            {shipment.id}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {shipment.parcel.sizeBand}
          </span>
        </div>
        <StatusChip status={shipment.status} />
      </div>

      {/* Route & Receiver */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-[10px] text-slate-400">Route</div>
          <div className="font-semibold text-slate-800">
            {shipment.route.origin} → {shipment.route.destination}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Receiver</div>
          <div className="font-semibold text-slate-800">
            {shipment.receiver.name} ({shipment.receiver.phone.slice(-4)})
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 flex sm:justify-end items-end">
          <PriceDisplay amount={shipment.price.total} size="sm" />
        </div>
      </div>

      {/* Bottom: Last Event Note */}
      {lastEvent && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate max-w-[85%]">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{lastEvent.note}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>
      )}
    </Link>
  );
}
