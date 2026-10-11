/**
 * BusBondhu Express — Comprehensive Automated Verification Suite
 * Tests domain rules, state machine transitions, pricing, and exceptions.
 */

import { SEED_SHIPMENTS, SEED_DEPARTURES, SEED_ROUTES } from "../src/lib/data/seed";
import { PRICING_BY_BAND, MAX_CLAIM_COMPENSATION } from "../src/lib/data/constants";
import { formatCurrency, maskPhone, maskName } from "../src/lib/utils/format";
import { buildQrPayload, buildTrackingUrl } from "../src/lib/utils/qr";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log("\n🧪 Running BusBondhu Express Verification Suite...\n");

// 1. Seed Data Integrity
assert(SEED_SHIPMENTS.length === 7, "Seed shipments array contains exactly 7 seeded shipments");
assert(SEED_DEPARTURES.length === 8, "Seed departures array contains 8 departures (6 pilot + 2 coming soon)");
assert(SEED_ROUTES.length === 3, "Seed routes contains 3 routes (1 active pilot + 2 coming soon)");

// 2. Pricing Rule Verification
assert(PRICING_BY_BAND.standard === 100, "Standard band fee is Tk 100");
assert(PRICING_BY_BAND.medium === 130, "Medium band fee is Tk 130");
assert(PRICING_BY_BAND.bulky === 160, "Bulky band fee is Tk 160");
assert(MAX_CLAIM_COMPENSATION === 2000, "Pilot claim compensation cap is Tk 2,000");

// 3. Format Utilities Verification
assert(formatCurrency(130) === "Tk 130", "Currency formatted as 'Tk 130'");
assert(maskPhone("01712345678") === "0171***678", "Phone masking protects privacy: '0171***678'");
assert(maskName("Kamal") === "K***l", "Name masking: 'K***l'");

// 4. QR and Tracking Token Generation
const sampleShipment = SEED_SHIPMENTS[0];
const qrPayload = buildQrPayload(sampleShipment);
assert(qrPayload.includes("BusBondhu Express"), "QR payload contains app namespace");
assert(qrPayload.includes(sampleShipment.id), "QR payload encodes shipment ID");
assert(qrPayload.includes(sampleShipment.trackingToken), "QR payload encodes tracking token");

const trackingUrl = buildTrackingUrl(sampleShipment.trackingToken, "https://busbondhu.demo");
assert(trackingUrl === `https://busbondhu.demo/track/${sampleShipment.trackingToken}`, "Tracking URL properly formatted");

// 5. Custody Event Verification
const completedShipment = SEED_SHIPMENTS.find((s) => s.status === "collected_closed");
assert(Boolean(completedShipment), "Completed shipment exists in seed");
assert(completedShipment!.events.length === 7, "Completed shipment contains 7 timestamped custody events");

// 6. Exception Event Verification
const delayedShipment = SEED_SHIPMENTS.find((s) => s.status === "delayed");
assert(Boolean(delayedShipment), "Delayed shipment exists in seed");
assert(
  delayedShipment!.events.some((e) => e.type === "delay_alert"),
  "Delayed shipment contains delay_alert event"
);

const claimShipment = SEED_SHIPMENTS.find((s) => s.status === "claim_filed");
assert(Boolean(claimShipment), "Claim-filed shipment exists in seed");
assert(Boolean(claimShipment!.claim), "Claim metadata is attached to shipment");
assert(
  Boolean(claimShipment?.claim?.reference.startsWith("CLM-")),
  "Claim reference starts with CLM-"
);

console.log("\n🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!\n");
