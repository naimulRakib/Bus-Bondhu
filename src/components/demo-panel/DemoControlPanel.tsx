"use client";

import React, { useEffect } from "react";
import {
  SlidersHorizontal,
  X,
  Play,
  RotateCcw,
  FastForward,
  Clock,
  AlertTriangle,
  FileQuestion,
  Database,
  CheckCircle2,
  Phone,
  TrendingUp,
} from "lucide-react";
import { useDemoStore } from "@/lib/store/demo-store";
import { useShipmentStore } from "@/lib/store/shipment-store";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useDemoHotkey } from "@/lib/hooks/use-demo-hotkey";
import { cn } from "@/lib/utils";

export function DemoControlPanel() {
  useDemoHotkey();

  const {
    isPanelOpen,
    togglePanel,
    setPanelOpen,
    selectedShipmentId,
    setSelectedShipmentId,
    isAutoPlayRunning,
    setAutoPlayRunning,
    autoPlaySpeedSeconds,
    setAutoPlaySpeedSeconds,
    activeSmsModal,
    setActiveSmsModal,
    toggleInvestorLens,
  } = useDemoStore();

  const {
    shipments,
    advanceShipmentStage,
    triggerDelay,
    triggerMissingScan,
    resetToSeed: resetShipments,
    resetToEmpty: resetShipmentsEmpty,
  } = useShipmentStore();

  const {
    notifications,
    resetToSeed: resetNotifs,
    resetToEmpty: resetNotifsEmpty,
  } = useNotificationStore();

  // If no shipment selected, pick the first active one or first in list
  useEffect(() => {
    if (!selectedShipmentId && shipments.length > 0) {
      setSelectedShipmentId(shipments[0].id);
    }
  }, [selectedShipmentId, shipments, setSelectedShipmentId]);

  const currentShipment = shipments.find((s) => s.id === selectedShipmentId);

  // Auto-play timer effect
  useEffect(() => {
    if (!isAutoPlayRunning || !selectedShipmentId) return;

    const interval = setInterval(() => {
      const ship = shipments.find((s) => s.id === selectedShipmentId);
      if (!ship || ship.status === "collected_closed" || ship.status === "claim_filed") {
        setAutoPlayRunning(false);
        return;
      }
      advanceShipmentStage(selectedShipmentId);
    }, autoPlaySpeedSeconds * 1000);

    return () => clearInterval(interval);
  }, [
    isAutoPlayRunning,
    selectedShipmentId,
    autoPlaySpeedSeconds,
    shipments,
    advanceShipmentStage,
    setAutoPlayRunning,
  ]);

  // Determine what next stage will be
  const getNextStageLabel = (status?: string) => {
    switch (status) {
      case "booked":
        return "Accepted at Origin Counter";
      case "accepted_at_origin":
        return "Assigned to Bus Trip";
      case "assigned_to_trip":
        return "Loaded & Departed";
      case "loaded_departed":
        return "Unloaded at Destination";
      case "unloaded_at_destination":
        return "Receiver Notified (SMS)";
      case "receiver_notified":
        return "Collected & Closed";
      case "delayed":
        return "Resume to Unloading";
      default:
        return "Completed (Terminal State)";
    }
  };

  const handleAdvance = () => {
    if (selectedShipmentId) {
      advanceShipmentStage(selectedShipmentId);
    }
  };

  // Preset Handlers
  const handleHappyPathPreset = () => {
    if (!selectedShipmentId) return;
    handleAdvance();
    setAutoPlayRunning(true);
  };

  const handleDelayPreset = () => {
    if (selectedShipmentId) {
      triggerDelay(selectedShipmentId);
    }
  };

  const handleMissingScanPreset = () => {
    if (selectedShipmentId) {
      triggerMissingScan(selectedShipmentId);
    }
  };

  const handleResetData = () => {
    resetShipmentsEmpty();
    resetNotifsEmpty();
    setAutoPlayRunning(false);
  };

  const handleLoadSeed = () => {
    resetShipments();
    resetNotifs();
    setAutoPlayRunning(false);
    if (shipments.length > 0) {
      setSelectedShipmentId("SHP-2401-003");
    }
  };

  // Recent simulated SMS toast
  const latestNotification = notifications[0];

  return (
    <>
      {/* Floating collapsed button */}
      {!isPanelOpen && (
        <button
          type="button"
          onClick={togglePanel}
          className="fixed bottom-20 md:bottom-5 right-4 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all border border-slate-700 cursor-pointer group hover:scale-105"
          aria-label="Open Demo Controls"
        >
          <SlidersHorizontal className="w-4 h-4 text-purple-400 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-semibold">Demo Controls</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono border border-slate-700">
            D
          </span>
        </button>
      )}

      {/* Expanded Floating Control Panel */}
      {isPanelOpen && (
        <aside
          aria-label="Demo Control Panel"
          className="fixed bottom-20 md:bottom-5 right-3 md:right-5 z-40 w-[92vw] max-w-[340px] max-h-[82vh] overflow-y-auto rounded-2xl bg-slate-950 text-slate-100 shadow-2xl border border-slate-800 p-4 text-xs font-sans flex flex-col gap-3.5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-900/60 text-purple-300 flex items-center justify-center">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100 text-xs">Demo Controls</h2>
                <p className="text-[10px] text-slate-400">Simulates counter & operator</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section A: Shipment Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>Selected Parcel:</span>
              <span className="text-[10px] text-purple-400 font-mono">
                {currentShipment?.status || "None"}
              </span>
            </label>
            <select
              value={selectedShipmentId || ""}
              onChange={(e) => setSelectedShipmentId(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-500"
            >
              {shipments.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.receiver.name} ({s.status})
                </option>
              ))}
            </select>
          </div>

          {/* Section B: Stage Advancer */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex flex-col gap-2">
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Next Handover Stage:</span>
              <span className="font-semibold text-amber-300">
                {getNextStageLabel(currentShipment?.status)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAdvance}
              disabled={
                !currentShipment ||
                currentShipment.status === "collected_closed" ||
                currentShipment.status === "claim_filed"
              }
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Advance One Stage</span>
            </button>
          </div>

          {/* Section C: Auto-Play Controls */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Play Presentation</span>
              </span>
              <button
                type="button"
                onClick={() => setAutoPlayRunning(!isAutoPlayRunning)}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer",
                  isAutoPlayRunning
                    ? "bg-emerald-500 text-slate-950 animate-pulse"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                )}
              >
                {isAutoPlayRunning ? "Running" : "Start"}
              </button>
            </div>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Speed:</span>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={autoPlaySpeedSeconds}
                onChange={(e) => setAutoPlaySpeedSeconds(Number(e.target.value))}
                className="flex-1 accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
              <span className="font-mono text-purple-300 w-6 text-right">
                {autoPlaySpeedSeconds}s
              </span>
            </div>
          </div>

          {/* Section D: Scenario Presets */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Scenario Presets
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={handleHappyPathPreset}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 text-[10px] font-semibold gap-1 transition-all cursor-pointer text-center"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Happy Path</span>
              </button>

              <button
                type="button"
                onClick={handleDelayPreset}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-[10px] font-semibold gap-1 transition-all cursor-pointer text-center"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Delay Trip</span>
              </button>

              <button
                type="button"
                onClick={handleMissingScanPreset}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 text-[10px] font-semibold gap-1 transition-all cursor-pointer text-center"
              >
                <FileQuestion className="w-3.5 h-3.5 text-rose-400" />
                <span>Missing Scan</span>
              </button>
            </div>
          </div>

          {/* Section E: SMS Preview Trigger & Link */}
          {latestNotification && (
            <div
              onClick={() => setActiveSmsModal(latestNotification)}
              className="bg-purple-950/40 border border-purple-800/60 rounded-xl p-2.5 flex items-start gap-2 cursor-pointer hover:bg-purple-950/60 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[10px] text-purple-300 font-semibold">
                  <span>Latest Simulated SMS:</span>
                  <span className="text-[9px] text-slate-400">Tap to expand</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate mt-0.5">
                  {latestNotification.message}
                </p>
              </div>
            </div>
          )}

          {/* Section E.5: Investor Pitch Lens Trigger */}
          <button
            type="button"
            onClick={toggleInvestorLens}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-900/70 to-indigo-900/70 hover:from-purple-800 hover:to-indigo-800 border border-purple-700/60 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-300 group-hover:scale-110 transition-transform" />
            <span>Investor Lens (Unit Econ &amp; TAM)</span>
          </button>

          {/* Section F: Data Controls */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleLoadSeed}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Database className="w-3 h-3 text-purple-400" />
              <span>Load Seed</span>
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="flex-1 py-1.5 px-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-900/60 text-rose-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              <span>Reset Data</span>
            </button>
          </div>
        </aside>
      )}

      {/* Simulated Phone SMS Modal */}
      {activeSmsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveSmsModal(null)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-700 flex flex-col gap-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Phone speaker notch placeholder */}
            <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Simulated SMS</div>
                  <div className="text-[10px] text-slate-400">
                    To: {activeSmsModal.recipientPhone} ({activeSmsModal.recipientRole})
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSmsModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated SMS Bubble */}
            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 text-xs leading-relaxed text-slate-200 font-sans shadow-inner">
              <p>{activeSmsModal.message}</p>
              <div className="text-[10px] text-slate-400 mt-2 text-right">
                {new Date(activeSmsModal.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="text-[10px] text-center text-slate-500 italic">
              Simulated in-app only. No real telecom charges or SMS dispatched.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
