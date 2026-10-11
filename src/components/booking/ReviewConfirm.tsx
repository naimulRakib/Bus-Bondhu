"use client";

import React from "react";
import { Route, Departure, Parcel, PaymentMode, PaymentMethod } from "@/lib/types";
import { PRICING_BY_BAND } from "@/lib/data/constants";
import {
  Bus,
  ShieldCheck,
  AlertCircle,
  Package,
} from "lucide-react";

interface ReviewConfirmProps {
  route: Route;
  departure: Departure;
  parcel: Parcel;
  receiver: {
    name: string;
    phone: string;
  };
  paymentMode: PaymentMode;
  paymentMethod: PaymentMethod;
}

export function ReviewConfirm({
  route,
  departure,
  parcel,
  receiver,
  paymentMode,
  paymentMethod,
}: ReviewConfirmProps) {
  const fee = PRICING_BY_BAND[parcel.sizeBand];

  return (
    <div className="flex flex-col gap-6">
      {/* Upfront Price Highlight Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
            Total Fixed Route Dispatch Fee
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight">
              Tk {fee}
            </span>
            <span className="text-[10px] uppercase font-bold text-blue-300 bg-blue-800/80 px-2 py-0.5 rounded border border-blue-700">
              indicative
            </span>
          </div>
          <p className="text-[11px] text-blue-200 mt-1">
            Flat price for {parcel.sizeBand.toUpperCase()} band. Upfront guaranteed fee.
          </p>
        </div>

        <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-blue-800/80 pt-3 sm:pt-0 sm:pl-4">
          <div className="text-[10px] text-blue-300 uppercase font-semibold">
            Settlement
          </div>
          <div className="text-xs font-bold text-white mt-0.5">
            {paymentMode === "pay_at_origin" ? "Pay at Origin (Prepaid)" : "Receiver Pays (Postpaid)"}
          </div>
          <div className="text-[11px] text-blue-200">
            Via {paymentMethod.toUpperCase()} (Simulated)
          </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Departure & Routing */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Bus className="w-4 h-4 text-blue-600" />
            <span>Trip Schedule & Handover</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Corridor Route</span>
              <div className="font-bold text-slate-900">
                {route.origin} → {route.destination}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400">Departure</span>
                <div className="font-semibold text-slate-800">
                  {departure.departureTime}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Drop-off Cutoff</span>
                <div className="font-bold text-rose-700">
                  {departure.cutoffTime}
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400">Estimated Ready Window</span>
              <div className="font-semibold text-slate-800">
                {departure.estimatedArrivalWindow.earliest} – {departure.estimatedArrivalWindow.latest}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400">Origin Drop-off Counter</span>
              <div className="font-medium text-slate-700">
                {departure.originCounter.name}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400">Destination Pickup Counter</span>
              <div className="font-medium text-slate-700">
                {departure.destinationCounter.name}
              </div>
            </div>
          </div>
        </div>

        {/* Parcel & Recipient Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Parcel & Receiver Details</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Recipient Contact</span>
              <div className="font-bold text-slate-900">{receiver.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                {receiver.phone}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400">Size Band</span>
                <div className="font-semibold text-slate-800 capitalize">
                  {parcel.sizeBand}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Declared Value</span>
                <div className="font-semibold text-slate-800">
                  Tk {parcel.declaredValue.toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400">Item Description</span>
              <div className="font-medium text-slate-700">
                {parcel.description}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Restricted items exclusion verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Policy Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          Arrival time is an <strong>estimated window</strong> based on road traffic and confirmed bus departures. Counter release requires the receiver to present the secret 6-digit collection code sent via SMS upon arrival.
        </p>
      </div>
    </div>
  );
}
