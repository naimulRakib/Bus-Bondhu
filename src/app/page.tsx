"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bus,
  ShieldCheck,
  ArrowRight,
  QrCode,
  Truck,
  Lock,
  MessageSquare,
  MapPin,
  Layers,
  Zap,
  TrendingUp,
  Package,
  Users,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { LiveRouteMap } from "@/components/map/LiveRouteMap";
import { DemoOrchestrator } from "@/components/demo-panel/DemoOrchestrator";
import { ShipmentStatus } from "@/lib/types";

const STATUS_CYCLE: ShipmentStatus[] = [
  "booked",
  "accepted_at_origin",
  "assigned_to_trip",
  "loaded_departed",
  "unloaded_at_destination",
  "receiver_notified",
  "collected_closed",
];

export default function LandingPage() {
  const { t } = useI18n();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [heroStatus, setHeroStatus] = useState<ShipmentStatus>("loaded_departed");
  const [statusIdx, setStatusIdx] = useState(3); // start at loaded_departed

  // Cycle through statuses for hero map preview
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((prev) => {
        const next = (prev + 1) % STATUS_CYCLE.length;
        setHeroStatus(STATUS_CYCLE[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const journeySteps = [
    { num: 1, icon: QrCode,        title: t("journey.step1"), desc: t("journey.step1Desc"), badge: "Merchant" },
    { num: 2, icon: ShieldCheck,   title: t("journey.step2"), desc: t("journey.step2Desc"), badge: "Origin Counter" },
    { num: 3, icon: Layers,        title: t("journey.step3"), desc: t("journey.step3Desc"), badge: "Manifest Lock" },
    { num: 4, icon: Truck,         title: t("journey.step4"), desc: t("journey.step4Desc"), badge: "Bus Operator" },
    { num: 5, icon: MapPin,        title: t("journey.step5"), desc: t("journey.step5Desc"), badge: "Dest Counter" },
    { num: 6, icon: MessageSquare, title: t("journey.step6"), desc: t("journey.step6Desc"), badge: "Automated SMS" },
    { num: 7, icon: Lock,          title: t("journey.step7"), desc: t("journey.step7Desc"), badge: "Verified Pickup" },
  ];

  const metrics = [
    { label: "Parcels/Bus/Day",   value: "8–12",   icon: Package,    color: "text-blue-400" },
    { label: "Take Rate",         value: "Tk 130",  icon: TrendingUp, color: "text-emerald-400" },
    { label: "Merchants Targeted",value: "500K+",  icon: Users,      color: "text-purple-400" },
    { label: "Bus Routes",        value: "3 Routes",icon: Bus,        color: "text-amber-400" },
  ];

  return (
    <>
      <DemoOrchestrator isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* ─── Top Header ──────────────────────────────────────────────────────── */}
        <header className="border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-900/50">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 leading-none">
                  <span className="font-extrabold text-base tracking-tight text-white">BusBondhu</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">
                    Express
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ideathon Bangladesh 2026</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <button
                onClick={() => setIsDemoOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition-all hover:scale-105 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                Start Demo
              </button>
              <Link
                href="/home"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
              >
                <span>App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* ─── HERO ────────────────────────────────────────────────────────────── */}
        <main className="flex-1">
          <section className="relative max-w-6xl mx-auto px-4 pt-12 pb-8 flex flex-col lg:flex-row gap-8 items-center">
            {/* Left: Headline + CTA */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-300 text-xs font-semibold w-fit">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t("landing.pilotRoute")}</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                {t("landing.heroTitle")}
              </h1>

              <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-lg">
                {t("landing.heroSubtitle")}
              </p>

              {/* Primary CTA: Demo */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  id="landing-start-demo-btn"
                  onClick={() => setIsDemoOpen(true)}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-2xl shadow-blue-900/60 transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                >
                  <Zap className="w-5 h-5" />
                  ▶ Start Demo Presentation
                </button>

                <Link
                  href="/track/trk-rahim-001"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 font-semibold text-sm transition-all"
                >
                  <span>Receiver Tracking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Pitch points */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  "Upfront price (Tk 100/130/160)",
                  "Every handover QR-scanned",
                  "6-digit SMS collection code",
                  "No fleet — existing bus routes",
                ].map((pt) => (
                  <div key={pt} className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Map Preview */}
            <div className="w-full lg:w-[480px] shrink-0">
              <div className="relative">
                {/* Glow effect behind map */}
                <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-3xl scale-110" />
                <LiveRouteMap
                  shipmentStatus={heroStatus}
                  shipmentId="SHP-2401-003"
                  receiverName="Noor Islam (Cumilla)"
                  className="relative"
                />
                {/* Overlay label */}
                <div className="absolute top-14 right-3 bg-slate-900/90 border border-slate-700/60 rounded-xl px-3 py-2 text-[10px] text-slate-300 backdrop-blur-sm">
                  <div className="font-bold text-slate-100 mb-0.5">Live Route Tracking</div>
                  <div className="text-slate-400">Dhaka → Cumilla · Auto-cycling</div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Metrics Strip ──────────────────────────────────────────────────── */}
          <section className="border-y border-slate-800/60 bg-slate-900/40 py-8">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-white">{m.value}</div>
                      <div className="text-[11px] text-slate-500">{m.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── 7-Step Journey ─────────────────────────────────────────────────── */}
          <section className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-white">{t("landing.journeyTitle")}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Every handover is a time-stamped custody event — actor, location, photo condition
                </p>
              </div>
              <div className="text-xs font-semibold text-blue-400 bg-blue-950/40 border border-blue-800/40 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">D</kbd> for Demo Controls
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {journeySteps.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.num}
                    className="bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/60 hover:border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-900/60 text-blue-300 text-xs font-bold flex items-center justify-center">
                          {s.num}
                        </span>
                        <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/40">
                        {s.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-xs md:text-sm text-slate-100 mb-1">{s.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-snug">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── Value Props ─────────────────────────────────────────────────────── */}
          <section className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: "1", color: "blue",
                title: "Not a Fleet, a Custody Layer",
                desc: "We don't buy buses. We bring digital custody, timestamped scans, and trust to existing bus routes between any two cities.",
              },
              {
                num: "2", color: "amber",
                title: "Upfront Pricing by Size Band",
                desc: "Standard Tk 100, Medium Tk 130, Bulky Tk 160. Merchants know the exact fee before drop-off — no counter haggling.",
              },
              {
                num: "3", color: "emerald",
                title: "Secret 6-Digit Pickup Code",
                desc: "Receiver gets an SMS code when the parcel is verified at destination. QR alone is never sufficient proof.",
              },
            ].map((p) => (
              <div
                key={p.num}
                className="bg-slate-900/60 rounded-2xl border border-slate-800/60 p-6 flex flex-col gap-3"
              >
                <div className={`w-9 h-9 rounded-xl bg-${p.color}-900/50 text-${p.color}-400 flex items-center justify-center font-extrabold text-sm border border-${p.color}-800/40`}>
                  {p.num}
                </div>
                <h3 className="font-bold text-sm text-white">{p.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </section>

          {/* ─── Final CTA ───────────────────────────────────────────────────────── */}
          <section className="border-t border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950 py-16 text-center">
            <div className="max-w-xl mx-auto px-4 flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-900/60">
                <Bus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                See the Full Journey
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Click below to launch the investor demo — watch a parcel travel from a Dhaka merchant to a Cumilla receiver in real-time.
              </p>
              <button
                onClick={() => setIsDemoOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-2xl shadow-blue-900/50 transition-all hover:scale-[1.03] cursor-pointer"
              >
                <Zap className="w-5 h-5" />
                ▶ Launch Demo Presentation
              </button>
              <div className="text-xs text-slate-600">
                No sign-up · No real data · 100% simulated for Ideathon 2026
              </div>
            </div>
          </section>
        </main>

        {/* ─── Footer ──────────────────────────────────────────────────────────── */}
        <footer className="border-t border-slate-800/60 bg-slate-950 py-6 text-center text-xs text-slate-600">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">BusBondhu Express</span>
              <span>·</span>
              <span>Ideathon Bangladesh 2026 Customer Demo Prototype</span>
            </div>
            <div className="text-[11px] text-slate-600">
              Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-slate-500">D</kbd> anywhere for Demo Controls
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
