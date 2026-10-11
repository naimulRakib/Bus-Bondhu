import { delay } from "./client";
import { Notification } from "../types";
import { useNotificationStore } from "../store/notification-store";

export async function getNotifications(): Promise<Notification[]> {
  await delay(150);
  return useNotificationStore.getState().notifications;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await delay(100);
  useNotificationStore.getState().markAsRead(id);
}
