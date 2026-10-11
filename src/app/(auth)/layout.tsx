import React from "react";
import Link from "next/link";
import { Bus, ShieldCheck } from "lucide-react";
import { LanguageToggle } from "@/components/shared/LanguageToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 px-4 py-6">
      {/* Auth Header */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-900">
              BusBondhu Express
            </span>
          </div>
        </Link>
        <LanguageToggle />
      </header>

      {/* Main card */}
      <main className="max-w-md w-full mx-auto my-auto">{children}</main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-6">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Dhaka ↔ Cumilla Pilot Corridor</span>
      </footer>
    </div>
  );
}
