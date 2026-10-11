"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, SkipForward, RotateCcw, X, Zap, Bus, CheckCircle2 } from "lucide-react";
import { useDemoStore } from "@/lib/store/demo-store";
import { useShipmentStore } from "@/lib/store/shipment-store";
import { useNotificationStore } from "@/lib/store/notification-store";
import { LiveRouteMap } from "@/components/map/LiveRouteMap";
import { ShipmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── Demo script: ordered steps shown to investors ────────────────────────────
const DEMO_SCRIPT = [
  {
    id: "intro",
    title: "BusBondhu Express",
    subtitle: "Trust & Dispatch Layer for Intercity Parcels",
    desc: "Watch a real parcel travel from a Dhaka merchant to a Cumilla receiver — fully tracked, every handover verified.",
    badge: "INVESTOR DEMO",
    status: null as ShipmentStatus | null,
    color: "#3b82f6",
    duration: 3500,
  },
  {
    id: "booked",
    title: "Step 1 — Booking Confirmed",
    subtitle: "Merchant books via app · QR token generated",
    desc: "Rahim Textiles books a parcel for Cumilla. Upfront price: Tk 160. A QR label is generated instantly.",
    badge: "MERCHANT",
    status: "booked" as ShipmentStatus,
    color: "#3b82f6",
    duration: 4000,
  },
  {
    id: "accepted_at_origin",
    title: "Step 2 — Accepted at Origin Counter",
    subtitle: "Physical scan at Dhaka (Gulistan) counter",
    desc: "Counter staff scans the QR, verifies parcel condition, and logs a timestamped custody event.",
    badge: "ORIGIN COUNTER",
    status: "accepted_at_origin" as ShipmentStatus,
    color: "#6366f1",
    duration: 4000,
  },
  {
    id: "assigned_to_trip",
    title: "Step 3 — Assigned to Bus Trip",
    subtitle: "Manifest locked · Bus DK-305 confirmed",
    desc: "Parcel is assigned to the 10:30 AM Greenline departure. The manifest is cryptographically locked.",
    badge: "MANIFEST",
    status: "assigned_to_trip" as ShipmentStatus,
    color: "#8b5cf6",
    duration: 4000,
  },
  {
    id: "loaded_departed",
    title: "Step 4 — 🚌 Bus En Route",
    subtitle: "Loaded & departed · Live location tracking",
    desc: "The bus departs Dhaka. The parcel's digital custody status updates in real-time. ~100 km to Cumilla.",
    badge: "IN TRANSIT",
    status: "loaded_departed" as ShipmentStatus,
    color: "#0ea5e9",
    duration: 5000,
  },
  {
    id: "unloaded_at_destination",
    title: "Step 5 — Arrived at Cumilla",
    subtitle: "Unloaded & scanned at destination counter",
    desc: "Counter staff in Cumilla scans the parcel on arrival. Stored in secure shelf B-1.",
    badge: "DESTINATION",
    status: "unloaded_at_destination" as ShipmentStatus,
    color: "#10b981",
    duration: 4000,
  },
  {
    id: "receiver_notified",
    title: "Step 6 — 📱 SMS to Receiver",
    subtitle: "Secret 6-digit collection code dispatched",
    desc: "Receiver gets: 'Your parcel is ready. Collection code: 671940.' No one else knows this code.",
    badge: "SMS GATEWAY",
    status: "receiver_notified" as ShipmentStatus,
    color: "#a855f7",
    duration: 4500,
  },
  {
    id: "collected_closed",
    title: "Step 7 — ✅ Delivered!",
    subtitle: "Receiver verified · Shipment closed",
    desc: "Receiver presents collection code at counter. Parcel handed over. Chain of custody complete.",
    badge: "CLOSED",
    status: "collected_closed" as ShipmentStatus,
    color: "#22c55e",
    duration: 5000,
  },
];

type DemoMode = "idle" | "running" | "paused" | "done";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoOrchestrator({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<DemoMode>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0–100 within current step
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const { advanceShipmentStage, resetToSeed, shipments } = useShipmentStore();
  const { resetToSeed: resetNotifs } = useNotificationStore();
  const { setSelectedShipmentId } = useDemoStore();

  const DEMO_SHIPMENT_ID = "SHP-2401-003"; // "booked" status in seed
  const demoShipment = shipments.find((s) => s.id === DEMO_SHIPMENT_ID);
  const currentStep = DEMO_SCRIPT[stepIndex];

  // ─── Advance to next step ─────────────────────────────────────────────────
  const advanceStep = useCallback(() => {
    setStepIndex((prev) => {
      const next = prev + 1;
      if (next >= DEMO_SCRIPT.length) {
        setMode("done");
        return prev;
      }
      return next;
    });
    setProgress(0);
  }, []);

  // ─── Tick progress bar ────────────────────────────────────────────────────
  const startProgressTick = useCallback(
    (stepDuration: number) => {
      if (progressRef.current) clearInterval(progressRef.current);
      const tickInterval = 60; // ms
      const totalTicks = stepDuration / tickInterval;
      let ticks = 0;
      progressRef.current = setInterval(() => {
        ticks += 1;
        setProgress(Math.min((ticks / totalTicks) * 100, 100));
        if (ticks >= totalTicks) {
          if (progressRef.current) clearInterval(progressRef.current);
        }
      }, tickInterval);
    },
    []
  );

  // ─── Main step driver ─────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "running") return;
    if (stepIndex >= DEMO_SCRIPT.length) return;

    const step = DEMO_SCRIPT[stepIndex];

    // Sync shipment state if step has a status
    if (step.status && demoShipment) {
      // Drive the shipment store to the right status
      const statusOrder: ShipmentStatus[] = [
        "booked", "accepted_at_origin", "assigned_to_trip",
        "loaded_departed", "unloaded_at_destination", "receiver_notified", "collected_closed",
      ];
      const targetIdx = statusOrder.indexOf(step.status);
      const currentIdx = statusOrder.indexOf(demoShipment.status as ShipmentStatus);
      const needed = targetIdx - currentIdx;
      for (let i = 0; i < needed; i++) {
        advanceShipmentStage(DEMO_SHIPMENT_ID);
      }
    }

    startProgressTick(step.duration);

    timerRef.current = setTimeout(() => {
      if (stepIndex < DEMO_SCRIPT.length - 1) {
        advanceStep();
      } else {
        setMode("done");
        setProgress(100);
      }
    }, step.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mode, stepIndex]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleStart = () => {
    // Reset demo state
    resetToSeed();
    resetNotifs();
    setSelectedShipmentId(DEMO_SHIPMENT_ID);
    setStepIndex(0);
    setProgress(0);
    setMode("running");
  };

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    advanceStep();
    if (mode === "running") {
      // re-trigger the useEffect
      setMode("running");
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    resetToSeed();
    resetNotifs();
    setStepIndex(0);
    setProgress(0);
    setMode("idle");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  const activeStatus: ShipmentStatus =
    currentStep.status ?? (demoShipment?.status as ShipmentStatus) ?? "booked";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="BusBondhu Demo Presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-0 lg:gap-6 p-4 lg:p-8 overflow-y-auto">

        {/* ─── LEFT: Map ─────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/50">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white tracking-tight">BusBondhu Express</div>
                <div className="text-[10px] text-slate-400">Ideathon Bangladesh 2026 · Live Demo</div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close demo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Live Route Map */}
          <LiveRouteMap
            shipmentStatus={activeStatus}
            shipmentId={DEMO_SHIPMENT_ID}
            receiverName={demoShipment?.receiver.name ?? "Noor Islam"}
            className="flex-1"
          />

          {/* Step progress strip */}
          <div className="flex gap-1">
            {DEMO_SCRIPT.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                  i < stepIndex
                    ? "bg-emerald-500"
                    : i === stepIndex && mode === "running"
                    ? "bg-blue-500"
                    : "bg-slate-800"
                )}
              />
            ))}
          </div>
        </div>

        {/* ─── RIGHT: Script Card ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-[380px] flex flex-col gap-4 shrink-0">

          {/* Current Step Card */}
          <div
            className="rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-700 relative overflow-hidden"
            style={{
              borderColor: currentStep.color + "40",
              background: `linear-gradient(135deg, ${currentStep.color}10 0%, #0f172a 100%)`,
            }}
          >
            {/* Color accent top line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-all duration-700"
              style={{ background: currentStep.color }}
            />

            {/* Badge */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ color: currentStep.color, background: currentStep.color + "20" }}
              >
                {currentStep.badge}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {stepIndex + 1} / {DEMO_SCRIPT.length}
              </span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-extrabold text-white leading-tight mb-1">
                {currentStep.title}
              </h2>
              <p className="text-xs font-semibold text-slate-400">
                {currentStep.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentStep.desc}
            </p>

            {/* Step timer progress bar */}
            {mode === "running" && (
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-none"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: currentStep.color,
                    transition: "width 60ms linear",
                  }}
                />
              </div>
            )}
          </div>

          {/* ─── Controls ─────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {mode === "idle" && (
              <button
                id="demo-start-btn"
                onClick={handleStart}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-2xl shadow-blue-900/50 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Zap className="w-5 h-5" />
                Start Demo Presentation
              </button>
            )}

            {mode === "running" && (
              <div className="flex gap-2">
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                  Next Step
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-semibold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}

            {mode === "done" && (
              <div className="flex flex-col gap-2">
                <div className="rounded-xl bg-emerald-950/40 border border-emerald-800/40 p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-emerald-300">Demo Complete!</div>
                    <div className="text-xs text-slate-400 mt-0.5">Full chain of custody demonstrated</div>
                  </div>
                </div>
                <button
                  onClick={handleStart}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Play className="w-4 h-4" />
                  Replay Demo
                </button>
              </div>
            )}
          </div>

          {/* ─── All Steps Overview ───────────────────────────────────────────── */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 flex flex-col gap-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Journey Steps
            </div>
            {DEMO_SCRIPT.filter((s) => s.status).map((s, i) => {
              const realIndex = DEMO_SCRIPT.indexOf(s);
              const isDone = realIndex < stepIndex;
              const isActive = realIndex === stepIndex;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs transition-all",
                    isDone && "opacity-60",
                    isActive && "bg-slate-800/80"
                  )}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
                    style={{
                      backgroundColor: isDone ? "#10b981" + "30" : isActive ? s.color + "30" : "#1e293b",
                      color: isDone ? "#10b981" : isActive ? s.color : "#475569",
                      border: `1px solid ${isDone ? "#10b981" + "60" : isActive ? s.color + "60" : "#334155"}`,
                    }}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span
                    className={cn(
                      "font-medium",
                      isDone ? "text-slate-500 line-through" : isActive ? "text-white" : "text-slate-500"
                    )}
                  >
                    {s.title.replace(/^Step \d+ — /, "")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Investor note */}
          <div className="text-[10px] text-slate-600 text-center leading-relaxed">
            Demo only · No real SMS dispatched · No real buses
            <br />All data is simulated for Ideathon Bangladesh 2026
          </div>
        </div>
      </div>
    </div>
  );
}
