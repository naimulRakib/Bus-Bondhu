import { create } from "zustand";
import { ShipmentId, Notification } from "../types";

interface DemoState {
  isPanelOpen: boolean;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;

  selectedShipmentId: ShipmentId | null;
  setSelectedShipmentId: (id: ShipmentId | null) => void;

  isAutoPlayRunning: boolean;
  autoPlaySpeedSeconds: number;
  setAutoPlayRunning: (running: boolean) => void;
  setAutoPlaySpeedSeconds: (seconds: number) => void;

  activeSmsModal: Notification | null;
  setActiveSmsModal: (notif: Notification | null) => void;

  isInvestorLensOpen: boolean;
  setInvestorLensOpen: (open: boolean) => void;
  toggleInvestorLens: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isPanelOpen: false,
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setPanelOpen: (open: boolean) => set({ isPanelOpen: open }),

  selectedShipmentId: "SHP-2401-003", // Default to the 'booked' shipment for easy advance
  setSelectedShipmentId: (id) => set({ selectedShipmentId: id }),

  isAutoPlayRunning: false,
  autoPlaySpeedSeconds: 3,
  setAutoPlayRunning: (running) => set({ isAutoPlayRunning: running }),
  setAutoPlaySpeedSeconds: (seconds) => set({ autoPlaySpeedSeconds: seconds }),

  activeSmsModal: null,
  setActiveSmsModal: (notif) => set({ activeSmsModal: notif }),

  isInvestorLensOpen: false,
  setInvestorLensOpen: (open) => set({ isInvestorLensOpen: open }),
  toggleInvestorLens: () => set((state) => ({ isInvestorLensOpen: !state.isInvestorLensOpen })),
}));
