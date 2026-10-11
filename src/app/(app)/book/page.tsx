"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { RouteAndDate } from "@/components/booking/RouteAndDate";
import { ParcelDetails } from "@/components/booking/ParcelDetails";
import { DepartureSelect } from "@/components/booking/DepartureSelect";
import { ReceiverPayment } from "@/components/booking/ReceiverPayment";
import { ReviewConfirm } from "@/components/booking/ReviewConfirm";
import { SizeBand, PaymentMode, PaymentMethod } from "@/lib/types";
import { SEED_ROUTES, SEED_DEPARTURES } from "@/lib/data/seed";
import { createNewShipment } from "@/lib/api/shipments";
import { useAuthStore } from "@/lib/store/auth-store";

const STEP_LABELS = [
  "Route & Date",
  "Parcel Details",
  "Choose Departure",
  "Receiver & Pay",
  "Review & Confirm",
];

export default function BookingWizardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [routeId, setRouteId] = useState("route-dhk-cml");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [sizeBand, setSizeBand] = useState<SizeBand>("standard");
  const [description, setDescription] = useState("Wholesale Cotton Tops (8 pcs)");
  const [declaredValue, setDeclaredValue] = useState(2500);
  const [restrictedAcknowledged, setRestrictedAcknowledged] = useState(true);

  const [departureId, setDepartureId] = useState("DEP-002"); // 10:30 AM departure default

  const [receiverName, setReceiverName] = useState("Kamal Hasan");
  const [receiverPhone, setReceiverPhone] = useState("01812345678");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("pay_at_origin");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resolve active objects
  const activeRoute = SEED_ROUTES.find((r) => r.id === routeId) || SEED_ROUTES[0];
  const activeDeparture =
    SEED_DEPARTURES.find((d) => d.id === departureId) || SEED_DEPARTURES[1];

  // Validation per step
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!routeId) errs.route = "Please select a dispatch corridor";
      if (!date) errs.date = "Please select a departure date";
    }

    if (currentStep === 2) {
      if (!description.trim()) {
        errs.description = "Item description is required";
      }
      if (!declaredValue || declaredValue <= 0 || declaredValue > 5000) {
        errs.declaredValue = "Declared value must be between Tk 100 and Tk 5,000";
      }
      if (!restrictedAcknowledged) {
        errs.restrictedAcknowledged =
          "You must certify that no restricted or dangerous goods are enclosed";
      }
    }

    if (currentStep === 3) {
      if (!departureId) {
        errs.departure = "Please choose a confirmed bus departure";
      }
    }

    if (currentStep === 4) {
      if (!receiverName.trim()) {
        errs.receiverName = "Receiver name is required";
      }
      const cleanPhone = receiverPhone.trim();
      if (!cleanPhone || cleanPhone.length < 11 || !cleanPhone.startsWith("01")) {
        errs.receiverPhone = "Valid 11-digit Bangladesh phone number required (e.g. 018XXXXXXXX)";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const shipment = await createNewShipment({
        merchantId: user?.id || "user-01",
        routeId,
        departureId,
        parcel: {
          sizeBand,
          contentsCategory: "clothing_textile",
          declaredValue,
          description,
          restrictedItemsAcknowledged: true,
        },
        paymentMode,
        paymentMethod,
        receiver: {
          name: receiverName,
          phone: receiverPhone,
        },
      });

      router.push(`/book/confirm?id=${shipment.id}`);
    } catch (err: unknown) {
      setErrors({ submit: (err as Error).message || "Failed to confirm booking" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Wizard</span>
        </Link>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
          Confirmed Bus Dispatch Booking
        </span>
      </div>

      {/* Step Progress Indicator */}
      <StepIndicator
        currentStep={step}
        totalSteps={5}
        stepLabels={STEP_LABELS}
      />

      {/* General Submission Error */}
      {errors.submit && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          {errors.submit}
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[300px]">
        {step === 1 && (
          <RouteAndDate
            selectedRouteId={routeId}
            onSelectRoute={setRouteId}
            selectedDate={date}
            onSelectDate={setDate}
          />
        )}

        {step === 2 && (
          <ParcelDetails
            sizeBand={sizeBand}
            onSelectSizeBand={setSizeBand}
            description={description}
            onChangeDescription={setDescription}
            declaredValue={declaredValue}
            onChangeDeclaredValue={setDeclaredValue}
            restrictedAcknowledged={restrictedAcknowledged}
            onToggleAcknowledged={setRestrictedAcknowledged}
            errors={errors}
          />
        )}

        {step === 3 && (
          <DepartureSelect
            routeId={routeId}
            date={date}
            selectedDepartureId={departureId}
            onSelectDeparture={setDepartureId}
          />
        )}

        {step === 4 && (
          <ReceiverPayment
            receiverName={receiverName}
            onChangeReceiverName={setReceiverName}
            receiverPhone={receiverPhone}
            onChangeReceiverPhone={setReceiverPhone}
            paymentMode={paymentMode}
            onSelectPaymentMode={setPaymentMode}
            paymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            errors={errors}
          />
        )}

        {step === 5 && (
          <ReviewConfirm
            route={activeRoute}
            departure={activeDeparture}
            parcel={{
              sizeBand,
              contentsCategory: "clothing_textile",
              declaredValue,
              description,
              restrictedItemsAcknowledged: true,
            }}
            receiver={{
              name: receiverName,
              phone: receiverPhone,
            }}
            paymentMode={paymentMode}
            paymentMethod={paymentMethod}
          />
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <span>Continue to Step {step + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? "Confirming..." : "Confirm & Generate QR Label"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
