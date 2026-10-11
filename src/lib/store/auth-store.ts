import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Merchant } from "../types";
import { SEED_MERCHANTS } from "../data/seed";

interface AuthState {
  user: Merchant | null;
  isAuthenticated: boolean;
  loginWithPhone: (phone: string) => Merchant;
  logout: () => void;
  setMerchant: (merchant: Merchant) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: SEED_MERCHANTS[0], // Default logged in as Rahim Uddin for seamless demo
      isAuthenticated: true,
      loginWithPhone: (phone: string) => {
        const found = SEED_MERCHANTS.find((m) => m.phone === phone);
        const merchant: Merchant = found || {
          id: `user-${Date.now()}`,
          phone,
          name: "Demo Merchant",
          role: "merchant",
          businessName: "Demo Wholesale Store",
          savedReceivers: [
            { id: "rcv-gen-1", name: "Kamal Hasan", phone: "01812345678", usageCount: 2 },
          ],
        };
        set({ user: merchant, isAuthenticated: true });
        return merchant;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      setMerchant: (merchant: Merchant) => {
        set({ user: merchant, isAuthenticated: true });
      },
    }),
    {
      name: "busbondhu-auth-store",
    }
  )
);
