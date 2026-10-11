import { delay } from "./client";
import { Claim, FileClaimInput } from "../types";
import { useShipmentStore } from "../store/shipment-store";
import { MAX_CLAIM_COMPENSATION } from "../data/constants";

export async function submitClaim(input: FileClaimInput): Promise<Claim> {
  await delay(400);
  const now = new Date();
  const yearMonth = now.toISOString().slice(0, 7).replace("-", "");
  const rand = Math.floor(100 + Math.random() * 900);
  const reference = `CLM-${yearMonth}-${rand}`;

  const claim: Claim = {
    id: `clm-${Date.now()}`,
    shipmentId: input.shipmentId,
    type: input.type,
    description: input.description,
    photoUrl: input.photoUrl,
    status: "submitted",
    createdAt: now.toISOString(),
    reference,
    policyNote: `Pilot policy proposal: compensation capped at Tk ${MAX_CLAIM_COMPENSATION} per parcel; declared value capped at Tk 5,000.`,
  };

  useShipmentStore.getState().fileClaim(input.shipmentId, claim);
  return claim;
}
