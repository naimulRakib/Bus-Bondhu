"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import { useShipmentStore } from "@/lib/store/shipment-store";
import { StatusChip } from "@/components/shared/StatusChip";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Timeline } from "@/components/shipment/Timeline";
import { CountdownTimer } from "@/components/shipment/CountdownTimer";
import { SEED_DEPARTURES } from "@/lib/data/seed";
import { LiveRouteMap } from "@/components/map/LiveRouteMap";

export default function ShipmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const shipment = useShipmentStore((s) => s.getShipment(id));

  const [copied, setCopied] = useState(false);

  if (!shipment) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center gap-3">
        <h1 className="text-base font-bold text-slate-800">Shipment Not Found</h1>
        <p className="text-xs text-slate-500">
          The shipment ID &quot;{id}&quot; was not found in the demo database.
        </p>
        <Link
          href="/home"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const departure =
    SEED_DEPARTURES.find((d) => d.id === shipment.departureId) ||
    SEED_DEPARTURES[0];

  const trackingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/track/${shipment.trackingToken}`
      : `https://busbondhu.demo/track/${shipment.trackingToken}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `[BusBondhu Express] Tracking for shipment ${shipment.id}: ${trackingUrl}`
  )}`;

  return (
    <div className="flex flex-col gap-5">
      {/* Live Route Map */}
      <LiveRouteMap
        shipmentStatus={shipment.status}
        shipmentId={shipment.id}
        receiverName={shipment.receiver.name}
        className="w-full"
      />

      {/* Top back & actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipments</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/track/${shipment.trackingToken}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <span>Public Receiver View</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          </Link>
        </div>
      </div>

      {/* Main Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-mono font-bold text-slate-950">
                {shipment.id}
              </h1>
              <span className="text-[10px] uppercase font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {shipment.parcel.sizeBand}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {shipment.parcel.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CountdownTimer
              cutoffTime={departure.cutoffTime}
              status={shipment.status}
            />
            <StatusChip status={shipment.status} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <div className="text-[10px] text-slate-400">Route</div>
            <div className="font-semibold text-slate-900">
              {shipment.route.origin} → {shipment.route.destination}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Receiver</div>
            <div className="font-semibold text-slate-900">
              {shipment.receiver.name}
            </div>
            <div className="text-[10px] text-slate-500">
              {shipment.receiver.phone}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Est. Ready Window</div>
            <div className="font-semibold text-slate-900">
              {departure.estimatedArrivalWindow.earliest} – {departure.estimatedArrivalWindow.latest}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Upfront Fee</div>
            <PriceDisplay amount={shipment.price.total} size="sm" />
          </div>
        </div>

        {/* Share & Quick Link */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="text-[11px] text-slate-400">
            Trip: {departure.operatorName} ({departure.busIdentifier})
          </div>
        </div>
      </div>

      {/* Handover Custody Timeline with framer-motion */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Verified Handover Custody Timeline
            </h2>
            <p className="text-[11px] text-slate-500">
              Each stage is a timestamped event with verifiable actor and physical location.
            </p>
          </div>
          <span className="text-[10px] text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full font-bold border border-purple-200 hidden sm:inline">
            Simulate via Demo Controls (D)
          </span>
        </div>

        <Timeline
          events={shipment.events}
          currentStatus={shipment.status}
        />

        {/* Action Link to File Claim if exception occurred */}
        {(shipment.status === "missing_scan" ||
          shipment.status === "delayed" ||
          shipment.status === "damaged") && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between bg-rose-50/50 p-3 rounded-xl border border-rose-200">
            <span className="text-xs text-rose-800 font-semibold">
              Custody exception recorded on this shipment
            </span>
            <Link
              href={`/claim/${shipment.id}`}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              Report Issue / File Claim
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
