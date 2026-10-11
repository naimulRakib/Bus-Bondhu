import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Shipment,
  ShipmentId,
  TrackingToken,
  HandoverEvent,
  Claim,
  ShipmentStatus,
} from "../types";
import { SEED_SHIPMENTS } from "../data/seed";
import { useNotificationStore } from "./notification-store";
import { toast } from "sonner";

interface ShipmentState {
  shipments: Shipment[];
  getShipment: (id: ShipmentId) => Shipment | undefined;
  getShipmentByToken: (token: TrackingToken) => Shipment | undefined;
  createShipment: (shipment: Shipment) => void;
  advanceShipmentStage: (id: ShipmentId) => HandoverEvent | null;
  triggerDelay: (id: ShipmentId) => void;
  triggerMissingScan: (id: ShipmentId) => void;
  fileClaim: (shipmentId: ShipmentId, claim: Claim) => void;
  resetToSeed: () => void;
  resetToEmpty: () => void;
}

export const useShipmentStore = create<ShipmentState>()(
  persist(
    (set, get) => ({
      shipments: SEED_SHIPMENTS,

      getShipment: (id: ShipmentId) => {
        return get().shipments.find((s) => s.id === id);
      },

      getShipmentByToken: (token: TrackingToken) => {
        return get().shipments.find(
          (s) => s.trackingToken === token || s.id === token
        );
      },

      createShipment: (shipment: Shipment) => {
        set((state) => ({
          shipments: [shipment, ...state.shipments],
        }));

        // Send initial SMS confirmation
        useNotificationStore.getState().addNotification({
          id: `notif-${Date.now()}`,
          shipmentId: shipment.id,
          type: "sms_booking_confirmed",
          title: "Booking Confirmed",
          message: `[BusBondhu] Booking ${shipment.id} confirmed. Route: ${shipment.route.origin} to ${shipment.route.destination}. Show QR label at ${shipment.route.originCounter.name}. Track: https://busbondhu.demo/track/${shipment.trackingToken}`,
          timestamp: new Date().toISOString(),
          read: false,
          recipientPhone: shipment.receiver.phone,
          recipientRole: "receiver",
        });

        toast.success(`Booking ${shipment.id} Created`, {
          description: `SMS dispatched to ${shipment.receiver.phone}. Show QR label at ${shipment.route.originCounter.name}.`,
        });
      },

      advanceShipmentStage: (id: ShipmentId) => {
        const shipment = get().shipments.find((s) => s.id === id);
        if (!shipment) return null;

        const now = new Date().toISOString();
        let nextStatus: ShipmentStatus | null = null;
        let newEvent: HandoverEvent | null = null;

        switch (shipment.status) {
          case "booked":
            nextStatus = "accepted_at_origin";
            newEvent = {
              id: `evt-${Date.now()}`,
              type: "accepted_at_origin",
              timestamp: now,
              actor: {
                role: "origin_counter",
                name: shipment.route.originCounter.name,
              },
              location: shipment.route.originCounter.name,
              note: "Physical parcel received, QR label verified, condition checked.",
              condition: "Package sealed and undamaged",
            };
            break;

          case "accepted_at_origin":
            nextStatus = "assigned_to_trip";
            newEvent = {
              id: `evt-${Date.now()}`,
              type: "assigned_to_trip",
              timestamp: now,
              actor: {
                role: "origin_counter",
                name: "Dispatch Bay Staff",
              },
              location: shipment.route.originCounter.address,
              note: `Assigned to Departure ${shipment.departureId}. Added to luggage manifest.`,
            };
            break;

          case "assigned_to_trip":
            nextStatus = "loaded_departed";
            newEvent = {
              id: `evt-${Date.now()}`,
              type: "loaded_departed",
              timestamp: now,
              actor: {
                role: "bus_operator",
                name: "Bus Supervisor",
              },
              location: `${shipment.route.origin} Terminal Departure Gate`,
              note: "Loaded securely into luggage boot. Bus departed on route.",
            };

            useNotificationStore.getState().addNotification({
              id: `notif-${Date.now()}`,
              shipmentId: shipment.id,
              type: "status_update",
              title: "Bus Departed",
              message: `[BusBondhu] Parcel ${shipment.id} is on the bus towards ${shipment.route.destination}. Est. window: 1:30 PM – 3:00 PM.`,
              timestamp: now,
              read: false,
              recipientPhone: shipment.receiver.phone,
              recipientRole: "receiver",
            });
            break;

          case "loaded_departed":
          case "delayed":
            nextStatus = "unloaded_at_destination";
            newEvent = {
              id: `evt-${Date.now()}`,
              type: "unloaded_at_destination",
              timestamp: now,
              actor: {
                role: "destination_counter",
                name: shipment.route.destinationCounter.name,
              },
              location: shipment.route.destinationCounter.name,
              note: "Unloaded from bus boot. Logged into secure counter storage.",
            };
            break;

          case "unloaded_at_destination":
            nextStatus = "receiver_notified";
            newEvent = {
              id: `evt-${Date.now()}`,
              type: "receiver_notified",
              timestamp: now,
              actor: {
                role: "system",
                name: "Automated Dispatch SMS Gateway",
              },
              location: shipment.route.destinationCounter.name,
              note: `Ready for pickup. SMS dispatched to receiver with secret collection code.`,
            };

            useNotificationStore.getState().addNotification({
              id: `notif-${Date.now()}`,
              shipmentId: shipment.id,
              type: "sms_ready_to_collect",
              title: "Ready for Pickup!",
              message: `[BusBondhu] Your parcel ${shipment.id} is ready at ${shipment.route.destinationCounter.name}! Collection code: ${shipment.collectionCode}. Hours: ${shipment.route.destinationCounter.hours}. Track: https://busbondhu.demo/track/${shipment.trackingToken}`,
              timestamp: now,
              read: false,
              recipientPhone: shipment.receiver.phone,
              recipientRole: "receiver",
            });
            break;

          case "receiver_notified":
            nextStatus = "collected_closed";
            newEvent = {
              id: `evt-${Date.now()}`,
              type: "collected_closed",
              timestamp: now,
              actor: {
                role: "destination_counter",
                name: shipment.route.destinationCounter.name,
              },
              location: shipment.route.destinationCounter.name,
              note: `Handed over to ${shipment.receiver.name} after 6-digit collection code verification. Custody settlement closed.`,
            };
            break;

          default:
            return null;
        }

        if (nextStatus && newEvent) {
          const finalEvent = newEvent;
          set((state) => ({
            shipments: state.shipments.map((s) =>
              s.id === id
                ? {
                    ...s,
                    status: nextStatus!,
                    events: [...s.events, finalEvent],
                  }
                : s
            ),
          }));

          // Fire instant Sonner toast notification
          switch (nextStatus) {
            case "accepted_at_origin":
              toast.info("1/5: Accepted at Origin Counter", {
                description: `${shipment.route.originCounter.name} verified QR label & physical seal.`,
              });
              break;
            case "assigned_to_trip":
              toast.info("2/5: Assigned to Bus Trip", {
                description: `Manifest updated for Departure ${shipment.departureId}.`,
              });
              break;
            case "loaded_departed":
              toast.info("3/5: Loaded & Departed", {
                description: `Parcel secured in luggage boot. Bus departed on route.`,
              });
              break;
            case "unloaded_at_destination":
              toast.info("4/5: Unloaded at Destination", {
                description: `Arrived at ${shipment.route.destinationCounter.name}. Logged into secure storage.`,
              });
              break;
            case "receiver_notified":
              toast.success("5/5: Receiver Notified (SMS Sent)", {
                description: `Secret pickup code (${shipment.collectionCode}) texted to ${shipment.receiver.name}.`,
              });
              break;
            case "collected_closed":
              toast.success("Parcel Collected & Closed", {
                description: `Handover verified with 6-digit PIN. Custody cycle complete.`,
              });
              break;
          }

          return finalEvent;
        }

        return null;
      },

      triggerDelay: (id: ShipmentId) => {
        const shipment = get().shipments.find((s) => s.id === id);
        if (!shipment) return;

        const now = new Date().toISOString();
        const delayEvent: HandoverEvent = {
          id: `evt-delay-${Date.now()}`,
          type: "delay_alert",
          timestamp: now,
          actor: {
            role: "bus_operator",
            name: "Highway Dispatch Center",
          },
          location: "Dhaka-Chittagong Highway (Meghna Crossing)",
          note: "Heavy highway congestion detected. Revised estimated ready window: +1.5 hours.",
        };

        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: "delayed",
                  events: [...s.events, delayEvent],
                }
              : s
          ),
        }));

        useNotificationStore.getState().addNotification({
          id: `notif-delay-${Date.now()}`,
          shipmentId: shipment.id,
          type: "sms_delay_alert",
          title: "Transit Delay Notice",
          message: `[BusBondhu] Update for ${shipment.id}: Bus encountered highway traffic. Revised estimated ready window is delayed by approx 90 mins. Tracking: https://busbondhu.demo/track/${shipment.trackingToken}`,
          timestamp: now,
          read: false,
          recipientPhone: shipment.receiver.phone,
          recipientRole: "receiver",
        });

        toast.warning("Highway Delay Broadcasted", {
          description: `Congestion alert (+90m) texted to ${shipment.receiver.phone}.`,
        });
      },

      triggerMissingScan: (id: ShipmentId) => {
        const shipment = get().shipments.find((s) => s.id === id);
        if (!shipment) return;

        const now = new Date().toISOString();
        const missingEvent: HandoverEvent = {
          id: `evt-missing-${Date.now()}`,
          type: "missing_scan_alert",
          timestamp: now,
          actor: {
            role: "system",
            name: "Automated Custody Watcher",
          },
          location: "Central Audit System",
          note: "Expected handover scan window lapsed without digital confirmation. Flagged for investigation.",
        };

        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: "missing_scan",
                  events: [...s.events, missingEvent],
                }
              : s
          ),
        }));

        toast.error("Missing Scan Detected!", {
          description: "Handover confirmation lapsed. Audit alert flagged; claim filing open.",
        });
      },

      fileClaim: (shipmentId: ShipmentId, claim: Claim) => {
        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === shipmentId
              ? {
                  ...s,
                  status: "claim_filed",
                  claim,
                }
              : s
          ),
        }));

        useNotificationStore.getState().addNotification({
          id: `notif-claim-${Date.now()}`,
          shipmentId,
          type: "claim_acknowledged",
          title: "Claim Acknowledged",
          message: `[BusBondhu] Claim ${claim.reference} for shipment ${shipmentId} submitted. Covered under pilot policy (cap Tk 2,000). Support will verify scan logs within 24h.`,
          timestamp: new Date().toISOString(),
          read: false,
          recipientPhone: "01712345678",
          recipientRole: "merchant",
        });

        toast.success("Claim Acknowledged", {
          description: `Claim ${claim.reference} submitted. Verification team notified (Pilot cap Tk 2,000).`,
        });
      },

      resetToSeed: () => {
        set({ shipments: SEED_SHIPMENTS });
        toast.info("Demo Seed Loaded", {
          description: "Reset to 3 demo shipments and fresh custody events.",
        });
      },

      resetToEmpty: () => {
        set({ shipments: [] });
      },
    }),
    {
      name: "busbondhu-shipments-store",
    }
  )
);
