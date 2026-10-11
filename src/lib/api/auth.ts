import { delay } from "./client";
import { Merchant } from "../types";
import { useAuthStore } from "../store/auth-store";

export async function requestOtp(
  phone: string
): Promise<{ success: boolean; demoCode: string }> {
  await delay(300);
  // Log phone to simulate dispatch to provider
  if (!phone) {
    throw new Error("Phone number is required");
  }
  // Demo code is always 123456
  return { success: true, demoCode: "123456" };
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<{ user: Merchant }> {
  await delay(350);
  if (code !== "123456" && code.length !== 6) {
    throw new Error("Invalid verification code. Use demo code: 123456");
  }
  const user = useAuthStore.getState().loginWithPhone(phone);
  return { user };
}

export async function logoutUser(): Promise<void> {
  await delay(150);
  useAuthStore.getState().logout();
}
