"use client";

import React, { useState } from "react";
import { Zap } from "lucide-react";
import { DemoOrchestrator } from "@/components/demo-panel/DemoOrchestrator";

/**
 * Floating "▶ Start Demo" button visible on every page.
 * Opens the fullscreen DemoOrchestrator presentation.
 */
export function DemoLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating CTA — bottom-left, distinct from Demo Controls (bottom-right) */}
      {!isOpen && (
        <button
          id="demo-launch-btn"
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-5 left-4 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-900/50 hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-blue-500/40 group"
          aria-label="Start Live Demo"
        >
          <Zap className="w-4 h-4 text-blue-200 group-hover:animate-pulse" />
          <span className="text-xs font-bold tracking-wide">▶ Start Demo</span>
        </button>
      )}

      <DemoOrchestrator isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
