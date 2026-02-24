"use client";

import {createContext, useContext, useEffect, useState} from "react";
import type {ReactNode} from "react";
import type {SupportedCurrency} from "@/lib/currency";

type CurrencyContextValue = {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

type CurrencyProviderProps = {
  children: ReactNode;
  defaultCurrency: SupportedCurrency;
};

export function CurrencyProvider(props: CurrencyProviderProps) {
  const {children, defaultCurrency} = props;
  const [currency, setCurrencyState] = useState<SupportedCurrency>(defaultCurrency);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem("tripsaas.currency") : null;

      if (stored) {
        setCurrencyState(stored as SupportedCurrency);
      }
    } catch {
    }
  }, []);

  function setCurrency(next: SupportedCurrency) {
    setCurrencyState(next);

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("tripsaas.currency", next);
      }
    } catch {
    }
  }

  return <CurrencyContext.Provider value={{currency, setCurrency}}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);

  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return ctx;
}

