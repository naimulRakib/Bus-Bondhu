// ==========================================
// BusBondhu Express — Core Domain Types
// ==========================================

export type UserId = string;
export type ShipmentId = string;
export type DepartureId = string;
export type ClaimId = string;
export type TrackingToken = string;

export interface User {
  id: UserId;
  phone: string;
  name: string;
  role: "merchant";
}

export interface SavedReceiver {
  id: string;
  name: string;
  phone: string;
  usageCount: number;
}

export interface Merchant extends User {
  businessName: string;
  savedReceivers: SavedReceiver[];
}

export interface Counter {
  id: string;
  name: string;
  address: string;
  hours: string;
  operatorName: string;
  phone?: string;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  originCounter: Counter;
  destinationCounter: Counter;
  isActive: boolean;
}

export interface Departure {
  id: DepartureId;
  routeId: string;
  date: string; // ISO Date YYYY-MM-DD
  departureTime: string; // "10:30 AM"
  cutoffTime: string; // "10:00 AM"
  estimatedArrivalWindow: {
    earliest: string; // "1:30 PM"
    latest: string; // "3:00 PM"
  };
  operatorName: string;
  busIdentifier: string;
  capacityConfirmed: boolean;
  originCounter: Counter;
  destinationCounter: Counter;
}

export type SizeBand = "standard" | "medium" | "bulky";
export type ContentsCategory = "clothing_textile" | "general";
export type PaymentMode = "pay_at_origin" | "receiver_pays";
export type PaymentMethod = "bkash" | "nagad" | "cash";

export interface Parcel {
  sizeBand: SizeBand;
  contentsCategory: ContentsCategory;
  declaredValue: number; // max Tk 5,000 in pilot
  description: string;
  restrictedItemsAcknowledged: boolean;
}

export interface PriceBreakdown {
  routeFee: number; // 100, 130, 160
  total: number;
  currency: "BDT";
  label: "indicative";
}

export type ShipmentStatus =
  | "booked"
  | "accepted_at_origin"
  | "assigned_to_trip"
  | "loaded_departed"
  | "unloaded_at_destination"
  | "receiver_notified"
  | "collected_closed"
  // Exception statuses
  | "delayed"
  | "missing_scan"
  | "damaged"
  | "claim_filed";

export type EventType =
  | "booked"
  | "accepted_at_origin"
  | "assigned_to_trip"
  | "loaded_departed"
  | "unloaded_at_destination"
  | "receiver_notified"
  | "collected_closed"
  | "delay_alert"
  | "missing_scan_alert"
  | "damaged_alert";

export type ActorRole =
  | "system"
  | "origin_counter"
  | "bus_operator"
  | "destination_counter";

export interface HandoverEvent {
  id: string;
  type: EventType;
  timestamp: string; // ISO Datetime
  actor: {
    role: ActorRole;
    name: string;
  };
  location: string;
  note: string;
  condition?: string;
}

export type ClaimType = "delay" | "damaged" | "missing" | "wrong_handover";
export type ClaimStatus = "submitted" | "under_review" | "resolved";

export interface Claim {
  id: ClaimId;
  shipmentId: ShipmentId;
  type: ClaimType;
  description: string;
  photoUrl?: string;
  status: ClaimStatus;
  createdAt: string;
  reference: string;
  policyNote: string;
}

export interface Shipment {
  id: ShipmentId;
  trackingToken: TrackingToken;
  merchantId: UserId;
  parcel: Parcel;
  price: PriceBreakdown;
  paymentMode: PaymentMode;
  paymentMethod: PaymentMethod;
  receiver: {
    name: string;
    phone: string;
  };
  route: Route;
  departureId: DepartureId;
  status: ShipmentStatus;
  collectionCode: string; // 6-digit code
  events: HandoverEvent[];
  createdAt: string;
  claim?: Claim;
}

export type NotificationType =
  | "sms_booking_confirmed"
  | "sms_ready_to_collect"
  | "sms_delay_alert"
  | "claim_acknowledged"
  | "status_update";

export interface Notification {
  id: string;
  shipmentId: ShipmentId;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  recipientPhone: string;
  recipientRole: "merchant" | "receiver";
}

export interface CreateShipmentInput {
  merchantId: UserId;
  routeId: string;
  departureId: DepartureId;
  parcel: Parcel;
  paymentMode: PaymentMode;
  paymentMethod: PaymentMethod;
  receiver: {
    name: string;
    phone: string;
  };
}

export interface FileClaimInput {
  shipmentId: ShipmentId;
  type: ClaimType;
  description: string;
  photoUrl?: string;
}
