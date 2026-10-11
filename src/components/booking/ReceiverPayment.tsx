"use client";

import React from "react";
import { PaymentMode, PaymentMethod, SavedReceiver } from "@/lib/types";
import { useAuthStore } from "@/lib/store/auth-store";
import { User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReceiverPaymentProps {
  receiverName: string;
  onChangeReceiverName: (name: string) => void;
  receiverPhone: string;
  onChangeReceiverPhone: (phone: string) => void;
  paymentMode: PaymentMode;
  onSelectPaymentMode: (mode: PaymentMode) => void;
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  errors?: {
    receiverName?: string;
    receiverPhone?: string;
  };
}

export function ReceiverPayment({
  receiverName,
  onChangeReceiverName,
  receiverPhone,
  onChangeReceiverPhone,
  paymentMode,
  onSelectPaymentMode,
  paymentMethod,
  onSelectPaymentMethod,
  errors,
}: ReceiverPaymentProps) {
  const user = useAuthStore((s) => s.user);
  const savedReceivers = user?.savedReceivers || [];

  const handleSelectSaved = (r: SavedReceiver) => {
    onChangeReceiverName(r.name);
    onChangeReceiverPhone(r.phone);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Saved Receivers Quick Pills */}
      {savedReceivers.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-800">
            Quick Select Saved Receiver
          </label>
          <div className="flex flex-wrap gap-2">
            {savedReceivers.map((r) => {
              const isSelected =
                receiverName === r.name && receiverPhone === r.phone;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => handleSelectSaved(r)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5",
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  )}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {r.name} ({r.phone.slice(-4)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Receiver Name & Phone Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800">
            Receiver Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={receiverName}
              onChange={(e) => onChangeReceiverName(e.target.value)}
              placeholder="e.g. Kamal Hasan"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-500 bg-white text-slate-900"
            />
          </div>
          {errors?.receiverName && (
            <span className="text-[11px] text-rose-600 font-medium">
              {errors.receiverName}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800">
            Receiver Mobile Phone (for SMS Collection Code)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              value={receiverPhone}
              onChange={(e) => onChangeReceiverPhone(e.target.value)}
              placeholder="018XXXXXXXX"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-500 bg-white text-slate-900"
            />
          </div>
          <span className="text-[10px] text-slate-500">
            The 6-digit secret collection code will be sent to this number.
          </span>
          {errors?.receiverPhone && (
            <span className="text-[11px] text-rose-600 font-medium">
              {errors.receiverPhone}
            </span>
          )}
        </div>
      </div>

      {/* Payment Mode Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-800">
          Payment Settlement Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => onSelectPaymentMode("pay_at_origin")}
            className={cn(
              "p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-1",
              paymentMode === "pay_at_origin"
                ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
              <span>Pay at Origin Counter (Prepaid)</span>
              {paymentMode === "pay_at_origin" && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Sender pays dispatch route fee upon parcel drop-off.
            </p>
          </div>

          <div
            onClick={() => onSelectPaymentMode("receiver_pays")}
            className={cn(
              "p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-1",
              paymentMode === "receiver_pays"
                ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
              <span>Receiver Pays at Destination (Postpaid)</span>
              {paymentMode === "receiver_pays" && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Recipient pays dispatch fee at Cumilla counter before release.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method Recording (Simulated) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-800">
          Selected Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2.5 max-w-sm">
          {[
            { id: "bkash", label: "bKash", color: "text-pink-600" },
            { id: "nagad", label: "Nagad", color: "text-orange-600" },
            { id: "cash", label: "Cash", color: "text-emerald-700" },
          ].map((m) => {
            const isSelected = paymentMethod === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => onSelectPaymentMethod(m.id as PaymentMethod)}
                className={cn(
                  "py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-900 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                )}
              >
                <span className={m.color}>●</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
        <span className="text-[10px] text-slate-400">
          Simulated payment channel. No actual monetary transactions executed in demo.
        </span>
      </div>
    </div>
  );
}
