"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  Upload,
  Camera,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { submitClaim } from "@/lib/api/claims";
import { ClaimType } from "@/lib/types";
import { useShipmentStore } from "@/lib/store/shipment-store";
import { MAX_CLAIM_COMPENSATION } from "@/lib/data/constants";
import { ClaimTypeSelect } from "@/components/claim/ClaimTypeSelect";
import { PolicySummary } from "@/components/claim/PolicySummary";

// Sample damaged package data URI for instant 1-click demo in pitches
const SAMPLE_PROOF_PHOTO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23f1f5f9'/><rect x='80' y='60' width='440' height='280' rx='16' fill='%23cbd5e1' stroke='%2394a3b8' stroke-width='4'/><path d='M80 160 L520 160 M280 60 L280 340' stroke='%2364748b' stroke-width='3' stroke-dasharray='6,6'/><path d='M220 190 L260 250 L320 220 L360 270' stroke='%23ef4444' stroke-width='5' fill='none'/><text x='300' y='120' font-family='sans-serif' font-size='20' font-weight='bold' text-anchor='middle' fill='%23334155'>[BUS-BONDHU INSPECTION EVIDENCE]</text><text x='300' y='310' font-family='monospace' font-size='14' text-anchor='middle' fill='%23dc2626'>CRUSHED CORNER &amp; BROKEN SEAL DETECTED</text></svg>";

export default function ClaimPage() {
  const params = useParams();
  const router = useRouter();
  const shipmentId = params?.shipmentId as string;

  const shipment = useShipmentStore((s) => s.getShipment(shipmentId));

  const [type, setType] = useState<ClaimType>("delay");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("01712-345678");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState(shipment?.claim || null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePhoto = () => {
    setPhotoUrl(SAMPLE_PROOF_PHOTO);
    setPhotoName("sample_evidence_crushed_carton.svg");
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    setPhotoName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const claim = await submitClaim({
        shipmentId,
        type,
        description: description || "Custody exception reported by merchant.",
        photoUrl: photoUrl || undefined,
      });
      setSubmittedClaim(claim);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRef = (refText: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/shipment/${shipmentId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipment</span>
        </Link>
        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
          Pilot Custody Guarantee
        </span>
      </div>

      {/* Shipment Snapshot Banner */}
      {shipment && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Shipment Under Review
            </div>
            <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
              {shipment.id}
            </div>
            <div className="text-slate-500 mt-0.5">
              {shipment.route.origin} → {shipment.route.destination} • {shipment.parcel.sizeBand.toUpperCase()} band
            </div>
          </div>
          <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
            <div className="text-[10px] text-slate-400">Recipient</div>
            <div className="font-semibold text-slate-800">{shipment.receiver.name}</div>
            <div className="text-slate-500 font-mono text-[11px]">{shipment.receiver.phone}</div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col gap-6">
        {submittedClaim ? (
          /* Success / Active Claim Screen */
          <div className="flex flex-col gap-5 text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Claim Registered & Handover Audit Initiated
              </h1>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Your incident report has been recorded against timestamped bus luggage logs and counter intake scans.
              </p>
            </div>

            {/* Reference Number Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto w-full flex items-center justify-between gap-3">
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Claim Reference Number
                </div>
                <div className="font-mono font-bold text-base text-slate-900">
                  {submittedClaim.reference}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyRef(submittedClaim.reference)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Evidence Image Preview if present */}
            {submittedClaim.photoUrl && (
              <div className="max-w-md mx-auto w-full text-left">
                <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  <span>Submitted Evidence Preview:</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 bg-slate-100 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={submittedClaim.photoUrl}
                    alt="Claim evidence preview"
                    className="w-full h-auto object-contain max-h-48"
                  />
                </div>
              </div>
            )}

            {/* 3-Step Audit SLA Roadmap */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 text-left max-w-md mx-auto w-full space-y-3">
              <div className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Verification & Settlement Roadmap (24h SLA)</span>
              </div>

              <div className="space-y-2 text-xs text-blue-900">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong>Digital Audit:</strong> Cross-referencing departure gate scan with destination intake logs.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong>Counter Contact:</strong> Verification call with dispatch supervisor within 12 hours.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong>Settlement:</strong> Approved compensation (up to Tk {MAX_CLAIM_COMPENSATION}) disbursed via bKash.
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/shipment/${shipmentId}`)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Return to Shipment Overview
              </button>
              <Link
                href="/notifications"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors text-center"
              >
                View SMS & Notification Log
              </Link>
            </div>
          </div>
        ) : (
          /* Claim Submission Form */
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <h1 className="text-lg font-bold text-slate-950">
                File a Custody Exception or Claim
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                BusBondhu guarantees timestamped accountability at every bus handover point.
              </p>
            </div>

            {/* Category Selector */}
            <ClaimTypeSelect value={type} onChange={setType} />

            {/* Description Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                2. Describe What Happened
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide specific notes (e.g., package corner torn, contents inspected at counter, counter manager was notified)..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 text-slate-900 bg-white leading-relaxed"
                required
              />
            </div>

            {/* Photo Upload & Preview */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  <span>3. Attach Photo Evidence (Simulated or Real)</span>
                </label>
                <button
                  type="button"
                  onClick={handleUseSamplePhoto}
                  className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold underline cursor-pointer"
                >
                  Quick Demo: Use Sample Photo
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="claim-photo-input"
              />

              {photoUrl ? (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {photoName || "evidence_photo.jpg"}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Ready to attach to audit file</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-5 text-center cursor-pointer bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      Click to upload photos
                    </span>
                    <span className="text-xs text-slate-500"> or drag and drop</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    PNG, JPG, or SVG up to 5MB (processed locally in browser demo)
                  </p>
                </div>
              )}
            </div>

            {/* Merchant Contact Callback */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                4. Callback Contact Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                placeholder="017XX-XXXXXX"
                required
              />
              <span className="text-[10px] text-slate-400">
                Our custody investigation desk will call this number within 12h.
              </span>
            </div>

            {/* Policy Comparison Card */}
            <PolicySummary />

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>
                {loading ? "Registering Incident..." : "Submit Incident for Handover Audit"}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
