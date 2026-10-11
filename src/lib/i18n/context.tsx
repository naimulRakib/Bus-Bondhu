"use client";

import React, { createContext, useContext, useState } from "react";
import en from "./en.json";
import bn from "./bn.json";

type Locale = "en" | "bn";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (keyPath: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("busbondhu_locale") as Locale | null;
      if (saved === "en" || saved === "bn") return saved;
    }
    return "en";
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("busbondhu_locale", newLocale);
    }
  };

  const t = (keyPath: string): string => {
    const dict = locale === "bn" ? bn : en;
    const fallbackDict = en;

    const resolve = (obj: Record<string, unknown>, path: string): string | null => {
      const parts = path.split(".");
      let current: unknown = obj;
      for (const part of parts) {
        if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
          current = (current as Record<string, unknown>)[part];
        } else {
          return null;
        }
      }
      return typeof current === "string" ? current : null;
    };

    const val = resolve(dict as Record<string, unknown>, keyPath);
    if (val !== null) return val;

    const fallbackVal = resolve(fallbackDict as Record<string, unknown>, keyPath);
    if (fallbackVal !== null) return fallbackVal;

    return keyPath;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
