"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShipmentStatus } from "@/lib/types";

// ─── Bangladesh city coordinates (SVG viewport 0-800 x 0-600) ─────────────────
const CITIES: Record<string, { x: number; y: number; label: string }> = {
  dhaka:     { x: 340, y: 270, label: "Dhaka" },
  cumilla:   { x: 490, y: 320, label: "Cumilla" },
  chattogram:{ x: 560, y: 420, label: "Chattogram" },
  sylhet:    { x: 560, y: 195, label: "Sylhet" },
  rajshahi:  { x: 165, y: 230, label: "Rajshahi" },
  khulna:    { x: 190, y: 400, label: "Khulna" },
  mymensingh:{ x: 370, y: 170, label: "Mymensingh" },
  barishal:  { x: 345, y: 420, label: "Barishal" },
};

// Ordered journey stops for Dhaka→Cumilla route
const ROUTE_STOPS = ["dhaka", "cumilla"] as const;

interface BusPosition {
  x: number;
  y: number;
  progress: number; // 0–1 along the route
}

function interpolate(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// Map status → bus position progress (0 = Dhaka, 1 = Cumilla)
function statusToProgress(status: ShipmentStatus): number {
  switch (status) {
    case "booked":                return 0;
    case "accepted_at_origin":    return 0.05;
    case "assigned_to_trip":      return 0.1;
    case "loaded_departed":       return 0.55;
    case "delayed":               return 0.45; // stuck mid-way
    case "unloaded_at_destination":return 0.95;
    case "receiver_notified":     return 1.0;
    case "collected_closed":      return 1.0;
    case "claim_filed":           return 0.45;
    default:                      return 0;
  }
}

function statusToLabel(status: ShipmentStatus): string {
  switch (status) {
    case "booked":                return "Booking Confirmed";
    case "accepted_at_origin":    return "Accepted at Origin Counter";
    case "assigned_to_trip":      return "Assigned to Bus Trip";
    case "loaded_departed":       return "🚌 En Route — Dhaka → Cumilla";
    case "delayed":               return "⚠️ Delayed — Meghna Bridge";
    case "unloaded_at_destination":return "Unloaded at Cumilla";
    case "receiver_notified":     return "📱 SMS Sent to Receiver";
    case "collected_closed":      return "✅ Collected & Closed";
    case "claim_filed":           return "🔴 Claim Filed";
    default:                      return "In Transit";
  }
}

function statusToColor(status: ShipmentStatus): string {
  if (status === "delayed" || status === "claim_filed") return "#f59e0b";
  if (status === "collected_closed") return "#10b981";
  if (status === "receiver_notified") return "#8b5cf6";
  return "#3b82f6";
}

interface Props {
  shipmentStatus: ShipmentStatus;
  shipmentId: string;
  receiverName: string;
  className?: string;
}

export function LiveRouteMap({ shipmentStatus, shipmentId, receiverName, className }: Props) {
  const targetProgress = statusToProgress(shipmentStatus);
  const [animProgress, setAnimProgress] = useState(targetProgress);
  const animRef = useRef<number | null>(null);
  const prevProgress = useRef(animProgress);

  // Smooth animation toward target progress
  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const from = prevProgress.current;
    const to = targetProgress;
    const duration = 1800; // ms
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setAnimProgress(current);
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        prevProgress.current = to;
      }
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [targetProgress]);

  // Bus position
  const origin = CITIES[ROUTE_STOPS[0]];
  const dest = CITIES[ROUTE_STOPS[1]];
  const busPos: BusPosition = {
    ...interpolate(origin, dest, animProgress),
    progress: animProgress,
  };

  const accentColor = statusToColor(shipmentStatus);
  const isInTransit = shipmentStatus === "loaded_departed" || shipmentStatus === "delayed";

  // Route line progress for the "traveled" segment
  const traveledEnd = interpolate(origin, dest, Math.min(animProgress, 1));

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl ${className ?? ""}`}>
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-slate-950/95 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <span className="text-xs font-bold text-white/90">{statusToLabel(shipmentStatus)}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
          {shipmentId}
        </span>
      </div>

      {/* SVG Map */}
      <svg
        viewBox="0 0 800 550"
        className="w-full h-full"
        style={{ minHeight: 280 }}
        aria-label="Live parcel route map"
      >
        {/* Background gradient */}
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="busGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Road pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="800" height="550" fill="url(#bgGrad)" />
        <rect width="800" height="550" fill="url(#grid)" />

        {/* Bangladesh outline (simplified SVG path) */}
        <path
          d="M 200 120 L 280 100 L 360 90 L 440 100 L 520 130 L 590 170 L 620 230 L 610 300 L 580 380 L 540 450 L 490 490 L 430 510 L 370 505 L 310 490 L 260 460 L 210 420 L 175 370 L 155 310 L 150 250 L 165 200 Z"
          fill="#0f2d1a"
          stroke="#1a4a2e"
          strokeWidth="1.5"
          opacity="0.7"
        />

        {/* Water bodies (rivers) */}
        <path
          d="M 340 270 Q 360 290 380 310 Q 400 330 420 320 Q 450 310 470 325 Q 500 340 490 320"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="2"
          opacity="0.4"
          strokeDasharray="4 4"
        />

        {/* Secondary city dots */}
        {Object.entries(CITIES)
          .filter(([key]) => !ROUTE_STOPS.includes(key as typeof ROUTE_STOPS[number]))
          .map(([key, city]) => (
            <g key={key}>
              <circle cx={city.x} cy={city.y} r={5} fill="#1e3a5f" stroke="#334155" strokeWidth="1" opacity="0.8" />
              <text x={city.x + 8} y={city.y + 4} fill="#475569" fontSize="9" fontFamily="system-ui">{city.label}</text>
            </g>
          ))}

        {/* ─── Main Route: Full dashed line (unfinished) ─── */}
        <line
          x1={origin.x} y1={origin.y}
          x2={dest.x} y2={dest.y}
          stroke="#334155"
          strokeWidth="3"
          strokeDasharray="8 6"
          opacity="0.5"
        />

        {/* ─── Traveled portion of route ─── */}
        {animProgress > 0 && (
          <line
            x1={origin.x} y1={origin.y}
            x2={traveledEnd.x} y2={traveledEnd.y}
            stroke={accentColor}
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
            opacity="0.9"
          />
        )}

        {/* ─── Origin City (Dhaka) ─── */}
        <g filter="url(#glow)">
          <circle cx={origin.x} cy={origin.y} r={14} fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
          <circle cx={origin.x} cy={origin.y} r={8} fill="#3b82f6" opacity="0.9" />
          <text x={origin.x} y={origin.y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui">DH</text>
        </g>
        <text x={origin.x} y={origin.y - 20} textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold" fontFamily="system-ui">
          Dhaka
        </text>
        <text x={origin.x} y={origin.y - 9} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="system-ui">
          Origin Counter
        </text>

        {/* ─── Destination City (Cumilla) ─── */}
        <g filter={animProgress >= 0.9 ? "url(#glow)" : undefined}>
          <circle cx={dest.x} cy={dest.y} r={14} fill={animProgress >= 0.9 ? "#14532d" : "#1e3a5f"} stroke={animProgress >= 0.9 ? "#10b981" : "#334155"} strokeWidth="2" />
          <circle cx={dest.x} cy={dest.y} r={8} fill={animProgress >= 0.9 ? "#10b981" : "#475569"} opacity="0.9" />
          <text x={dest.x} y={dest.y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui">CM</text>
        </g>
        <text x={dest.x} y={dest.y - 20} textAnchor="middle" fill={animProgress >= 0.9 ? "#6ee7b7" : "#94a3b8"} fontSize="11" fontWeight="bold" fontFamily="system-ui">
          Cumilla
        </text>
        <text x={dest.x} y={dest.y - 9} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="system-ui">
          Destination Counter
        </text>

        {/* ─── Bus Icon ─── */}
        {(animProgress > 0 && animProgress < 1) && (
          <g transform={`translate(${busPos.x}, ${busPos.y})`} filter="url(#busGlow)">
            {/* Pulse ring */}
            {isInTransit && (
              <circle r={22} fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.3">
                <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Bus body */}
            <rect x={-16} y={-10} width={32} height={20} rx={5} fill={accentColor} />
            {/* Bus windows */}
            <rect x={-11} y={-6} width={9} height={7} rx={1.5} fill="rgba(255,255,255,0.4)" />
            <rect x={2} y={-6} width={9} height={7} rx={1.5} fill="rgba(255,255,255,0.4)" />
            {/* Bus wheels */}
            <circle cx={-8} cy={10} r={4} fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            <circle cx={8} cy={10} r={4} fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            {/* Speed lines for moving bus */}
            {isInTransit && (
              <>
                <line x1={-20} y1={-4} x2={-28} y2={-4} stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <line x1={-20} y1={0} x2={-30} y2={0} stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
                <line x1={-20} y1={4} x2={-26} y2={4} stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
              </>
            )}
          </g>
        )}

        {/* ─── Collected = pin at destination ─── */}
        {animProgress >= 1 && (
          <g transform={`translate(${dest.x}, ${dest.y - 35})`} filter="url(#glow)">
            <circle r={14} fill="#10b981" />
            <text y={5} textAnchor="middle" fill="white" fontSize="14">✓</text>
          </g>
        )}

        {/* ─── Delay marker ─── */}
        {shipmentStatus === "delayed" && (
          <g transform={`translate(${busPos.x}, ${busPos.y - 32})`}>
            <rect x={-32} y={-12} width={64} height={22} rx={4} fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
            <text y={4} textAnchor="middle" fill="#fcd34d" fontSize="9" fontWeight="bold" fontFamily="system-ui">⚠ DELAY</text>
          </g>
        )}

        {/* ─── Distance label ─── */}
        <text x="415" y="278" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="system-ui">
          ~100 km
        </text>

        {/* ─── Progress bar at bottom ─── */}
        <rect x={40} y={520} width={720} height={6} rx={3} fill="#1e293b" />
        <rect x={40} y={520} width={720 * Math.min(animProgress, 1)} height={6} rx={3} fill={accentColor} />
        <text x={40} y={540} fill="#475569" fontSize="8" fontFamily="system-ui">Dhaka</text>
        <text x={760} y={540} textAnchor="end" fill="#475569" fontSize="8" fontFamily="system-ui">Cumilla</text>
        <text x={40 + 720 * Math.min(animProgress, 1)} y={515} textAnchor="middle" fill={accentColor} fontSize="9" fontWeight="bold" fontFamily="system-ui">
          {Math.round(animProgress * 100)}%
        </text>
      </svg>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/95 to-transparent px-4 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Receiver:</span>
            <span className="text-[10px] font-semibold text-slate-200">{receiverName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-[10px] font-mono text-slate-400">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
