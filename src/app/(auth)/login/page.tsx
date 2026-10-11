"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, KeyRound } from "lucide-react";
import { requestOtp, verifyOtp } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("01712345678");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      setError("Please enter a valid 11-digit phone number");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await requestOtp(phone);
      setDemoCode(res.demoCode);
      setStep("otp");
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(phone, otp || "123456");
      router.push("/home");
    } catch (err: unknown) {
      setError((err as Error).message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-slate-900">Merchant Portal Login</h1>
        <p className="text-xs text-slate-500">
          Enter your mobile number to manage parcels and view handover custody.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {step === "phone" ? (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Mobile Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Demo preset: 01712345678 (Rahim Textiles)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Sending..." : "Get Demo Verification Code"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Demo OTP Code: <strong className="font-mono text-sm">{demoCode || "123456"}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOtp("123456")}
              className="text-blue-700 underline text-[11px] font-semibold cursor-pointer"
            >
              Fill code
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">6-Digit Code</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full text-center tracking-widest text-lg font-mono py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Verifying..." : "Verify & Enter Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setStep("phone")}
            className="text-xs text-slate-500 hover:text-slate-800 text-center transition-colors cursor-pointer"
          >
            Change Phone Number
          </button>
        </form>
      )}

      <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-400">
        Simulated authentication. No actual SMS or real passwords required.
      </div>
    </div>
  );
}
