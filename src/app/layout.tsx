import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { DemoBanner } from "@/components/shared/DemoBanner";
import { DemoControlPanel } from "@/components/demo-panel/DemoControlPanel";
import { InvestorLensModal } from "@/components/investor/InvestorLensModal";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BusBondhu Express — Trust & Dispatch for Intercity Bus Parcels",
  description:
    "Custody, proof, and settlement layer for intercity bus parcels. Verified departures, upfront pricing, and live tracking.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans">
        <I18nProvider>
          <DemoBanner />
          <div className="flex-1 flex flex-col">{children}</div>
          <DemoControlPanel />
          <InvestorLensModal />
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              className: "font-sans text-xs",
            }}
          />
        </I18nProvider>
      </body>
    </html>
  );
}
