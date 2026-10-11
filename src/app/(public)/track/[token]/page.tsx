"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, AlertTriangle } from "lucide-react";
import { useShipmentStore } from "@/lib/store/shipment-store";
import { StatusChip } from "@/components/shared/StatusChip";
import { CollectionCode } from "@/components/tracking/CollectionCode";
import { CounterInfo } from "@/components/tracking/CounterInfo";
import { ReceiverTimeline } from "@/components/tracking/ReceiverTimeline";
import { SEED_DEPARTURES } from "@/lib/data/seed";

export default function ReceiverTrackPage() {
  const params = useParams();
  const token = params?.token as string;
  const shipment = useShipmentStore((s) => s.getShipmentByToken(token));

  if (!shipment) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center gap-3">
        <h1 className="text-base font-bold text-slate-900">Parcel Not Found</h1>
        <p className="text-xs text-slate-500 max-w-sm">
          No parcel record matching token &quot;{token}&quot; was found.
        </p>
        <Link
          href="/"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Return to BusBondhu Home
        </Link>
      </div>
    );
  }

  const departure =
    SEED_DEPARTURES.find((d) => d.id === shipment.departureId) ||
    SEED_DEPARTURES[0];

  // Masking helpers
  const maskPhone = (phone: string) => {
    if (phone.length <= 6) return phone;
    return `${phone.slice(0, 4)}***${phone.slice(-3)}`;
  };

  const maskName = (name: string) => {
    if (name.length <= 2) return name;
    return `${name.charAt(0)}***${name.slice(-1)}`;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Verified Bus Parcel Tracking
            </span>
            <h1 className="text-base font-bold text-slate-950 font-mono">
              {shipment.id}
            </h1>
          </div>
          <StatusChip status={shipment.status} />
        </div>

        {/* Masked Participants */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <div className="text-[10px] text-slate-400">Sender (Masked)</div>
            <div className="font-semibold text-slate-800">
              Merchant Parcel Dispatch
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Islampur Wholesale Cluster
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <div className="text-[10px] text-slate-400">Recipient (You)</div>
            <div className="font-semibold text-slate-800">
              {maskName(shipment.receiver.name)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {maskPhone(shipment.receiver.phone)}
            </div>
          </div>
        </div>

        {/* Estimated Ready Window */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>
              Estimated Ready Window:{" "}
              <strong>
                {departure.estimatedArrivalWindow.earliest} –{" "}
                {departure.estimatedArrivalWindow.latest}
              </strong>
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            indicative
          </span>
        </div>
      </div>

      {/* Secret Collection Code Section */}
      <CollectionCode
        code={shipment.collectionCode}
        status={shipment.status}
      />

      {/* Destination Counter Pickup Details */}
      <CounterInfo counter={shipment.route.destinationCounter} />

      {/* Simplified Timeline */}
      <ReceiverTimeline
        events={shipment.events}
        status={shipment.status}
      />

      {/* Report Issue Link */}
      <div className="pt-2 text-center">
        <Link
          href={`/claim/${shipment.id}`}
          className="text-xs text-rose-600 hover:text-rose-800 hover:underline font-semibold inline-flex items-center gap-1"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Have an issue with this shipment? File a pilot report</span>
        </Link>
      </div>
    </div>
  );
}
