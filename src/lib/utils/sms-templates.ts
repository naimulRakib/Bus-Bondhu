/**
 * Programmatic SMS dispatch templates for BusBondhu Express
 */

export function getBookingConfirmedTemplate(
  shipmentId: string,
  origin: string,
  destination: string,
  counterName: string,
  token: string
): string {
  return `[BusBondhu] Booking ${shipmentId} confirmed. Route: ${origin} to ${destination}. Show QR label at ${counterName}. Track: https://busbondhu.demo/track/${token}`;
}

export function getDepartureTemplate(
  shipmentId: string,
  destination: string,
  windowText: string
): string {
  return `[BusBondhu] Parcel ${shipmentId} is on the bus towards ${destination}. Est. arrival window: ${windowText}.`;
}

export function getReadyToCollectTemplate(
  shipmentId: string,
  counterName: string,
  collectionCode: string,
  hours: string,
  token: string
): string {
  return `[BusBondhu] Your parcel ${shipmentId} is ready at ${counterName}! Collection code: ${collectionCode}. Hours: ${hours}. Track: https://busbondhu.demo/track/${token}`;
}

export function getDelayAlertTemplate(
  shipmentId: string,
  minutesDelayed: number,
  token: string
): string {
  return `[BusBondhu] Update for ${shipmentId}: Bus encountered highway traffic. Revised estimated ready window is delayed by approx ${minutesDelayed} mins. Tracking: https://busbondhu.demo/track/${token}`;
}

export function getClaimAcknowledgedTemplate(
  reference: string,
  shipmentId: string,
  policyCap = 2000
): string {
  return `[BusBondhu] Claim ${reference} for shipment ${shipmentId} registered. Covered under pilot policy (cap Tk ${policyCap}). Support will verify scan logs within 24h.`;
}
