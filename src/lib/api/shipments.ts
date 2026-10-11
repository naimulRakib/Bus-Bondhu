import { delay } from "./client";
import {
  Shipment,
  ShipmentId,
  TrackingToken,
  CreateShipmentInput,
} from "../types";
import { useShipmentStore } from "../store/shipment-store";
import { SEED_ROUTES, SEED_DEPARTURES } from "../data/seed";
import { PRICING_BY_BAND } from "../data/constants";

export async function getActiveShipments(
  merchantId: string
): Promise<Shipment[]> {
  await delay(200);
  const shipments = useShipmentStore.getState().shipments;
  return shipments.filter(
    (s) =>
      s.merchantId === merchantId &&
      s.status !== "collected_closed" &&
      s.status !== "claim_filed"
  );
}

export async function getShipmentHistory(
  merchantId: string
): Promise<Shipment[]> {
  await delay(200);
  const shipments = useShipmentStore.getState().shipments;
  return shipments.filter(
    (s) =>
      s.merchantId === merchantId &&
      (s.status === "collected_closed" || s.status === "claim_filed")
  );
}

export async function getShipmentById(
  id: ShipmentId
): Promise<Shipment | null> {
  await delay(150);
  return useShipmentStore.getState().getShipment(id) || null;
}

export async function getShipmentByToken(
  token: TrackingToken
): Promise<Shipment | null> {
  await delay(200);
  return useShipmentStore.getState().getShipmentByToken(token) || null;
}

export async function createNewShipment(
  input: CreateShipmentInput
): Promise<Shipment> {
  await delay(350);
  const route =
    SEED_ROUTES.find((r) => r.id === input.routeId) || SEED_ROUTES[0];
  const departure =
    SEED_DEPARTURES.find((d) => d.id === input.departureId) ||
    SEED_DEPARTURES[0];

  const routeFee = PRICING_BY_BAND[input.parcel.sizeBand];
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const shipmentId: ShipmentId = `SHP-2401-${randomSuffix}`;
  const trackingToken: TrackingToken = `trk-${randomSuffix}`;
  const collectionCode = Math.floor(100000 + Math.random() * 900000).toString();

  const newShipment: Shipment = {
    id: shipmentId,
    trackingToken,
    merchantId: input.merchantId,
    parcel: input.parcel,
    price: {
      routeFee,
      total: routeFee,
      currency: "BDT",
      label: "indicative",
    },
    paymentMode: input.paymentMode,
    paymentMethod: input.paymentMethod,
    receiver: input.receiver,
    route,
    departureId: departure.id,
    status: "booked",
    collectionCode,
    createdAt: new Date().toISOString(),
    events: [
      {
        id: `evt-${Date.now()}`,
        type: "booked",
        timestamp: new Date().toISOString(),
        actor: { role: "system", name: "BusBondhu Dispatch Engine" },
        location: "Online Dispatch System",
        note: "Initial booking confirmed. QR label generated.",
      },
    ],
  };

  useShipmentStore.getState().createShipment(newShipment);
  return newShipment;
}
