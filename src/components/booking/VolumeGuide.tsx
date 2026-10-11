"use client";

import React from "react";
import { SizeBand } from "@/lib/types";
import { PRICING_BY_BAND } from "@/lib/data/constants";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Package, Box, Layers, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface VolumeGuideProps {
  selectedBand: SizeBand;
  onSelectBand: (band: SizeBand) => void;
}

export function VolumeGuide({ selectedBand, onSelectBand }: VolumeGuideProps) {
  const bands: {
    id: SizeBand;
    name: string;
    weightLimit: string;
    examples: string;
    icon: typeof Package;
  }[] = [
    {
      id: "standard",
      name: "Standard",
      weightLimit: "Up to 3 kg (~shoe box size)",
      examples: "5–8 shirts, fabric sample cut pieces, lightweight accessories",
      icon: Package,
    },
    {
      id: "medium",
      name: "Medium",
      weightLimit: "3 kg – 7 kg (~medium carton)",
      examples: "10–15 ready-made garments, denim pairs, footwear carton",
      icon: Box,
    },
    {
      id: "bulky",
      name: "Bulky",
      weightLimit: "7 kg – 12 kg (~large wholesale bundle)",
      examples: "Winter jackets carton, full textile roll, bulk restock box",
      icon: Layers,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800">
          Parcel Size & Upfront Rate Band
        </label>
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <Info className="w-3 h-3 text-blue-600" />
          <span>Weighed at counter upon drop-off</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {bands.map((b) => {
          const Icon = b.icon;
          const isSelected = selectedBand === b.id;
          const fee = PRICING_BY_BAND[b.id];

          return (
            <div
              key={b.id}
              onClick={() => onSelectBand(b.id)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 text-left relative",
                isSelected
                  ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-100 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{b.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {b.weightLimit}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                {b.examples}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <PriceDisplay amount={fee} size="sm" />
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
