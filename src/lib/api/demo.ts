import { delay } from "./client";
import { ShipmentId, HandoverEvent } from "../types";
import { useShipmentStore } from "../store/shipment-store";
import { useNotificationStore } from "../store/notification-store";

export async function advanceShipmentStage(
  shipmentId: ShipmentId
): Promise<HandoverEvent | null> {
  await delay(250);
  return useShipmentStore.getState().advanceShipmentStage(shipmentId);
}

export async function triggerDelayScenario(
  shipmentId: ShipmentId
): Promise<void> {
  await delay(250);
  useShipmentStore.getState().triggerDelay(shipmentId);
}

export async function triggerMissingScanScenario(
  shipmentId: ShipmentId
): Promise<void> {
  await delay(250);
  useShipmentStore.getState().triggerMissingScan(shipmentId);
}

export async function resetAllData(): Promise<void> {
  await delay(200);
  useShipmentStore.getState().resetToEmpty();
  useNotificationStore.getState().resetToEmpty();
}

export async function loadSeedData(): Promise<void> {
  await delay(200);
  useShipmentStore.getState().resetToSeed();
  useNotificationStore.getState().resetToSeed();
}
