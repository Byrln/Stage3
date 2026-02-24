export type SupportedCurrency = "USD" | "EUR" | "GBP" | "JPY" | "CNY";

export function formatCurrency(amount: number, currency: SupportedCurrency, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

