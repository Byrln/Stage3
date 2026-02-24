import {useCallback, useMemo} from "react";
import {currencyMetadata, type CurrencyCode, formatCurrency} from "@/lib/currencies";

export type UseCurrencyResult = {
  currency: CurrencyCode;
  availableCurrencies: {code: CurrencyCode; label: string; symbol: string}[];
  formatAmount: (amountMinor: number, options?: {minimumFractionDigits?: number; maximumFractionDigits?: number}) => string;
};

type UseCurrencyOptions = {
  currency?: CurrencyCode;
};

export function useCurrency(options?: UseCurrencyOptions): UseCurrencyResult {
  const currency: CurrencyCode = options?.currency ?? "USD";

  const availableCurrencies = useMemo(
    () =>
      (Object.entries(currencyMetadata) as [CurrencyCode, (typeof currencyMetadata)[CurrencyCode]][]).map(
        ([code, meta]) => ({
          code,
          label: meta.label,
          symbol: meta.symbol,
        }),
      ),
    [],
  );

  const formatAmount = useCallback(
    (amountMinor: number, formatOptions?: {minimumFractionDigits?: number; maximumFractionDigits?: number}) =>
      formatCurrency({
        currency,
        amountMinor,
        minimumFractionDigits: formatOptions?.minimumFractionDigits,
        maximumFractionDigits: formatOptions?.maximumFractionDigits,
      }),
    [currency],
  );

  return {
    currency,
    availableCurrencies,
    formatAmount,
  };
}

