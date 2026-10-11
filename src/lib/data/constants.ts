import { SizeBand, ShipmentStatus } from "../types";

export const PRICING_BY_BAND: Record<SizeBand, number> = {
  standard: 100,
  medium: 130,
  bulky: 160,
};

export const MAX_DECLARED_VALUE = 5000;
export const MAX_CLAIM_COMPENSATION = 2000;

export const STATUS_LABELS: Record<ShipmentStatus, { en: string; bn: string; variant: "blue" | "amber" | "teal" | "red" | "orange" }> = {
  booked: {
    en: "Booking Confirmed",
    bn: "বুকিং নিশ্চিত হয়েছে",
    variant: "blue",
  },
  accepted_at_origin: {
    en: "Accepted at Origin Counter",
    bn: "কাউন্টারে জমা নেওয়া হয়েছে",
    variant: "blue",
  },
  assigned_to_trip: {
    en: "Assigned to Bus Trip",
    bn: "বাস ট্রিপে বরাদ্দকৃত",
    variant: "blue",
  },
  loaded_departed: {
    en: "Loaded & In Transit",
    bn: "বাসে লোডকৃত ও রওয়ানা হয়েছে",
    variant: "amber",
  },
  unloaded_at_destination: {
    en: "Unloaded at Destination",
    bn: "গন্তব্য কাউন্টারে খালাসকৃত",
    variant: "amber",
  },
  receiver_notified: {
    en: "Ready for Collection",
    bn: "গ্রহণের জন্য প্রস্তুত",
    variant: "teal",
  },
  collected_closed: {
    en: "Collected & Completed",
    bn: "পার্সেল সংগৃহীত ও সমাপ্ত",
    variant: "teal",
  },
  delayed: {
    en: "Trip Delayed",
    bn: "ট্রিপ বিলম্বিত",
    variant: "orange",
  },
  missing_scan: {
    en: "Missing Scan / Investigation",
    bn: "স্ক্যান অনুপস্থিত / তদন্তাধীন",
    variant: "red",
  },
  damaged: {
    en: "Condition Issue Reported",
    bn: "পার্সেল ক্ষতিগ্রস্ত চিহ্নিত",
    variant: "red",
  },
  claim_filed: {
    en: "Claim Filed",
    bn: "দাবি দাখিল করা হয়েছে",
    variant: "red",
  },
};

export const DEMO_DISCLAIMER_TEXT =
  "Prototype demo. Simulated data. No real parcels, payments or SMS.";
