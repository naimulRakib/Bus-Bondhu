"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PackagePlus, Bell, SlidersHorizontal, Bus, ShieldCheck, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageToggle } from "./LanguageToggle";
import { useAuthStore } from "@/lib/store/auth-store";
import { useNotificationStore } from "@/lib/store/notification-store";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) =>
    s.notifications.filter((n) => !n.read).length
  );
  const { togglePanel, isPanelOpen, toggleInvestorLens } = useDemoStore();

  const navItems = [
    {
      href: "/home",
      label: t("nav.home"),
      icon: Home,
      active: pathname === "/home" || pathname.startsWith("/shipment"),
    },
    {
      href: "/book",
      label: t("nav.book"),
      icon: PackagePlus,
      active: pathname.startsWith("/book"),
    },
    {
      href: "/notifications",
      label: t("nav.notifications"),
      icon: Bell,
      active: pathname.startsWith("/notifications"),
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-6">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <Link href="/home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold tracking-tight shadow-sm group-hover:bg-blue-700 transition-colors">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-sm tracking-tight text-slate-900">
                  BusBondhu
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                  Express
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-700 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Dhaka ↔ Cumilla Pilot</span>
              </div>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle />

            {/* Investor Lens Pitch Button */}
            <button
              type="button"
              onClick={toggleInvestorLens}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors cursor-pointer"
              title="Pitch Lens: Unit Economics & TAM"
            >
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
              <span>Investor Lens</span>
            </button>

            {/* Demo Controls Toggle Button */}
            <button
              type="button"
              onClick={togglePanel}
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer",
                isPanelOpen
                  ? "bg-purple-950 text-purple-200 border-purple-800 shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              )}
              title="Toggle Demo Controls (Hotkey: D)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span>Demo Controls</span>
              <kbd className="hidden lg:inline-block ml-1 px-1 py-0.2 text-[9px] bg-slate-200 text-slate-700 rounded border border-slate-300">
                D
              </kbd>
            </button>

            {/* Merchant Identity Pill */}
            {user && (
              <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                    {user.name}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 md:py-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden"
      >
        <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center h-full text-[11px] font-medium transition-colors relative",
                  item.active
                    ? "text-blue-600 font-semibold"
                    : "text-slate-700 hover:text-slate-900"
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
                {item.active && (
                  <span className="absolute top-0 w-8 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}

          {/* 4th Tab: Demo Panel trigger on mobile */}
          <button
            type="button"
            onClick={togglePanel}
            className={cn(
              "flex flex-col items-center justify-center h-full text-[11px] font-medium transition-colors cursor-pointer",
              isPanelOpen
                ? "text-purple-600 font-semibold"
                : "text-slate-700 hover:text-slate-900"
            )}
          >
            <SlidersHorizontal className="w-5 h-5 mb-0.5 text-purple-600" />
            <span>{t("nav.demo")}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
