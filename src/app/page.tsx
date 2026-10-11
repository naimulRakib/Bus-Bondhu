"use client";

import React from "react";
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
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/shared/LanguageToggle";

export default function LandingPage() {
  const { t } = useI18n();

  const journeySteps = [
    {
      num: 1,
      icon: QrCode,
      title: t("journey.step1"),
      desc: t("journey.step1Desc"),
      badge: "Merchant",
    },
    {
      num: 2,
      icon: ShieldCheck,
      title: t("journey.step2"),
      desc: t("journey.step2Desc"),
      badge: "Origin Counter",
    },
    {
      num: 3,
      icon: Layers,
      title: t("journey.step3"),
      desc: t("journey.step3Desc"),
      badge: "Manifest Lock",
    },
    {
      num: 4,
      icon: Truck,
      title: t("journey.step4"),
      desc: t("journey.step4Desc"),
      badge: "Bus Operator",
    },
    {
      num: 5,
      icon: MapPin,
      title: t("journey.step5"),
      desc: t("journey.step5Desc"),
      badge: "Dest Counter",
    },
    {
      num: 6,
      icon: MessageSquare,
      title: t("journey.step6"),
      desc: t("journey.step6Desc"),
      badge: "Automated SMS",
    },
    {
      num: 7,
      icon: Lock,
      title: t("journey.step7"),
      desc: t("journey.step7Desc"),
      badge: "Verified Pickup",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  BusBondhu
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  Express
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Ideathon Bangladesh 2026 Prototype
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
            >
              <span>{t("landing.cta")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-10">
        <section className="text-center max-w-2xl mx-auto flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>{t("landing.pilotRoute")}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            {t("landing.heroTitle")}
          </h1>

          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
            {t("landing.heroSubtitle")}
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <Link
              href="/home"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <span>{t("landing.cta")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/track/trk-rahim-001"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-sm transition-all"
            >
              <span>Sample Receiver Tracking</span>
            </Link>
          </div>

          {/* Pitch Note */}
          <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Counter-to-counter only · Upfront prices (Tk 100/130/160) · Seed data preloaded</span>
          </div>
        </section>

        {/* 7-Step Journey Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                {t("landing.journeyTitle")}
              </h2>
              <p className="text-xs text-slate-500">
                Every physical handover is cryptographically logged with actor, location, and timestamp
              </p>
            </div>
            <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
              Simulated via Demo Controls (D)
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {journeySteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between transition-colors relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                        {s.num}
                      </span>
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {s.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs md:text-sm text-slate-900 mb-1">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pilot Value Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Not a Fleet, a Custody Layer
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We don&apos;t buy buses or claim intercity bus parcels are new. We bring digital custody, timestamped scans, and trust to existing bus routes.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Upfront Pricing by Size Band
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard Tk 100, Medium Tk 130, Bulky Tk 160. Merchants know the exact fee before drop-off—no arbitrary counter haggling.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Secret 6-Digit Pickup Code
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              QR alone is never sufficient proof. The receiver receives a secret SMS code when the parcel is verified at the destination counter.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">BusBondhu Express</span>
            <span>·</span>
            <span>Ideathon Bangladesh 2026 Customer Demo Prototype</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-slate-700">D</kbd> anywhere for Demo Controls
          </div>
        </div>
      </footer>
    </div>
  );
}
