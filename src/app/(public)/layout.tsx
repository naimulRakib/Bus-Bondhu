import React from "react";
import Link from "next/link";
import { Bus, ShieldCheck } from "lucide-react";
import { LanguageToggle } from "@/components/shared/LanguageToggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-sm tracking-tight text-slate-900">
                  BusBondhu Express
                </span>
                <span className="text-[10px] font-semibold uppercase text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                  Track
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Live Parcel Custody</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5">{children}</main>

      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-200 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>BusBondhu Express Custody Protocol · Dhaka ↔ Cumilla Pilot</span>
      </footer>
    </div>
  );
}
