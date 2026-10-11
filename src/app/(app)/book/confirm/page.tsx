"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Printer,
  ArrowRight,
  ExternalLink,
  Bus,
} from "lucide-react";
import { useShipmentStore } from "@/lib/store/shipment-store";
import { StatusChip } from "@/components/shared/StatusChip";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const shipment = useShipmentStore((s) =>
    id ? s.getShipment(id) : s.shipments[0]
  );

  const [copied, setCopied] = useState(false);

  if (!shipment) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center gap-3">
        <h1 className="text-base font-bold text-slate-900">No Booking Found</h1>
        <p className="text-xs text-slate-500">
          Please return to the merchant dashboard to select a parcel.
        </p>
        <Link
          href="/home"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const trackingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/track/${shipment.trackingToken}`
      : `https://busbondhu.demo/track/${shipment.trackingToken}`;

  const qrPayload = JSON.stringify({
    id: shipment.id,
    token: shipment.trackingToken,
    route: `${shipment.route.origin}-${shipment.route.destination}`,
    dep: shipment.departureId,
    band: shipment.parcel.sizeBand,
  });

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `[BusBondhu Express] Your parcel ${shipment.id} is confirmed from ${shipment.route.origin} to ${shipment.route.destination}. Track live custody here: ${trackingUrl}`
  )}`;

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      {/* Success Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">
          Booking Confirmed & QR Label Generated
        </h1>
        <p className="text-xs text-slate-500 max-w-sm">
          Your bus departure slot is locked. Present this digital or printed QR tag at the origin counter upon parcel drop-off.
        </p>
        <div className="mt-1">
          <StatusChip status={shipment.status} />
        </div>
      </div>

      {/* The Printable QR Label Card */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-6 shadow-sm flex flex-col items-center gap-4 relative">
        {/* Label Header */}
        <div className="w-full flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-slate-900">
                BUSBONDHU EXPRESS
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                Official Custody Tag
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
            {shipment.id}
          </span>
        </div>

        {/* Client-Side Generated QR Code */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <QRCodeSVG
            value={qrPayload}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Label Information Box */}
        <div className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs grid grid-cols-2 gap-2.5">
          <div>
            <div className="text-[10px] text-slate-400">Route</div>
            <div className="font-bold text-slate-900">
              {shipment.route.origin} → {shipment.route.destination}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400">Rate Band</div>
            <div className="font-bold text-slate-900 uppercase">
              {shipment.parcel.sizeBand} (Tk {shipment.price.total})
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400">Origin Drop-off</div>
            <div className="font-medium text-slate-700 truncate">
              {shipment.route.originCounter.name.split("–")[1]?.trim()}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400">Destination Pickup</div>
            <div className="font-medium text-slate-700 truncate">
              {shipment.route.destinationCounter.name.split("–")[1]?.trim()}
            </div>
          </div>

          <div className="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <span>Receiver: <strong>{shipment.receiver.name}</strong></span>
            <span className="font-mono text-slate-600">{shipment.receiver.phone}</span>
          </div>
        </div>

        {/* Print Label Action */}
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print / Save Parcel Label</span>
        </button>
      </div>

      {/* Share & Tracking Link Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-900">
          Share Real-Time Custody Link with Receiver
        </h3>

        {/* Copy Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={trackingUrl}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 truncate select-all"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <Link
            href={`/track/${shipment.trackingToken}`}
            target="_blank"
            className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Open Receiver View</span>
          </Link>
        </div>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link
          href="/home"
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 text-center transition-colors"
        >
          Return to Dashboard
        </Link>

        <Link
          href={`/shipment/${shipment.id}`}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
        >
          <span>View Handover Timeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function BookingConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500">
          Loading booking confirmation...
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
