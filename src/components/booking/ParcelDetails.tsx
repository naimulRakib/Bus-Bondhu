"use client";

import React from "react";
import { SizeBand } from "@/lib/types";
import { VolumeGuide } from "./VolumeGuide";
import { RestrictedItems } from "./RestrictedItems";
import { MAX_DECLARED_VALUE } from "@/lib/data/constants";

interface ParcelDetailsProps {
  sizeBand: SizeBand;
  onSelectSizeBand: (band: SizeBand) => void;
  description: string;
  onChangeDescription: (desc: string) => void;
  declaredValue: number;
  onChangeDeclaredValue: (val: number) => void;
  restrictedAcknowledged: boolean;
  onToggleAcknowledged: (val: boolean) => void;
  errors?: {
    description?: string;
    declaredValue?: string;
    restrictedAcknowledged?: string;
  };
}

export function ParcelDetails({
  sizeBand,
  onSelectSizeBand,
  description,
  onChangeDescription,
  declaredValue,
  onChangeDeclaredValue,
  restrictedAcknowledged,
  onToggleAcknowledged,
  errors,
}: ParcelDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Size Band Selector */}
      <VolumeGuide
        selectedBand={sizeBand}
        onSelectBand={onSelectSizeBand}
      />

      {/* Contents description & category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800">
            Contents Category
          </label>
          <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold flex items-center justify-between">
            <span>Clothing & Textiles (Retail Restock)</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
              Pilot Allowed
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            Pilot corridor is restricted to textiles and dry retail merchandise.
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800">
            Declared Value (Tk)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">
              Tk
            </span>
            <input
              type="number"
              min="100"
              max={MAX_DECLARED_VALUE}
              value={declaredValue || ""}
              onChange={(e) => onChangeDeclaredValue(Number(e.target.value))}
              placeholder="e.g. 2500"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white text-slate-900"
            />
          </div>
          <span className="text-[10px] text-slate-500">
            Capped at Tk {MAX_DECLARED_VALUE.toLocaleString()} for pilot liability coverage.
          </span>
          {errors?.declaredValue && (
            <span className="text-[11px] text-rose-600 font-medium">
              {errors.declaredValue}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-800">
          Parcel Item Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder="e.g. Cotton shirts bundle (8 pcs), silk shawls sample"
          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-500 bg-white text-slate-900"
        />
        {errors?.description && (
          <span className="text-[11px] text-rose-600 font-medium">
            {errors.description}
          </span>
        )}
      </div>

      {/* Prohibited items acknowledgement */}
      <RestrictedItems
        acknowledged={restrictedAcknowledged}
        onToggleAcknowledged={onToggleAcknowledged}
        error={errors?.restrictedAcknowledged}
      />
    </div>
  );
}
