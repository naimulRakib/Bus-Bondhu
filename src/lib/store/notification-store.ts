import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notification } from "../types";
import { SEED_NOTIFICATIONS } from "../data/seed";

interface NotificationState {
  notifications: Notification[];
  addNotification: (notif: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  resetToSeed: () => void;
  resetToEmpty: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: SEED_NOTIFICATIONS,
      addNotification: (notif: Notification) => {
        set((state) => ({
          notifications: [notif, ...state.notifications],
        }));
      },
      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      resetToSeed: () => {
        set({ notifications: SEED_NOTIFICATIONS });
      },
      resetToEmpty: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "busbondhu-notifications-store",
    }
  )
);
