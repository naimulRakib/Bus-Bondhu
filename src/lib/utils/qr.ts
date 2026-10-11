import { Shipment } from "../types";

/**
 * Builds the verification payload encoded into client-side parcel QR labels.
 */
export function buildQrPayload(shipment: Shipment): string {
  return JSON.stringify({
    app: "BusBondhu Express",
    shipmentId: shipment.id,
    token: shipment.trackingToken,
    route: `${shipment.route.origin}-${shipment.route.destination}`,
    departure: shipment.departureId,
    band: shipment.parcel.sizeBand,
    hash: shipment.trackingToken.slice(-6).toUpperCase(),
  });
}

export function buildTrackingUrl(token: string, origin?: string): string {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "https://busbondhu.demo");
  return `${base}/track/${token}`;
}
