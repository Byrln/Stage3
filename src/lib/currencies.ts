export const currencies = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "NZD",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "JPY",
  "CNY",
] as const;

export type CurrencyCode = (typeof currencies)[number];

export const currencyMetadata: Record<
  CurrencyCode,
  {
    label: string;
    symbol: string;
    minorUnit: number;
    locale: string;
  }
> = {
  USD: {
    label: "US Dollar",
    symbol: "$",
    minorUnit: 2,
    locale: "en-US",
  },
  EUR: {
    label: "Euro",
    symbol: "€",
    minorUnit: 2,
    locale: "de-DE",
  },
  GBP: {
    label: "British Pound",
    symbol: "£",
    minorUnit: 2,
    locale: "en-GB",
  },
  CAD: {
    label: "Canadian Dollar",
    symbol: "$",
    minorUnit: 2,
    locale: "en-CA",
  },
  AUD: {
    label: "Australian Dollar",
    symbol: "$",
    minorUnit: 2,
    locale: "en-AU",
  },
  NZD: {
    label: "New Zealand Dollar",
    symbol: "$",
    minorUnit: 2,
    locale: "en-NZ",
  },
  CHF: {
    label: "Swiss Franc",
    symbol: "CHF",
    minorUnit: 2,
    locale: "de-CH",
  },
  SEK: {
    label: "Swedish Krona",
    symbol: "kr",
    minorUnit: 2,
    locale: "sv-SE",
  },
  NOK: {
    label: "Norwegian Krone",
    symbol: "kr",
    minorUnit: 2,
    locale: "nb-NO",
  },
  DKK: {
    label: "Danish Krone",
    symbol: "kr",
    minorUnit: 2,
    locale: "da-DK",
  },
  JPY: {
    label: "Japanese Yen",
    symbol: "¥",
    minorUnit: 0,
    locale: "ja-JP",
  },
  CNY: {
    label: "Chinese Yuan",
    symbol: "¥",
    minorUnit: 2,
    locale: "zh-CN",
  },
};

type FormatCurrencyOptions = {
  currency: CurrencyCode;
  amountMinor: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(options: FormatCurrencyOptions): string {
  const {currency, amountMinor, minimumFractionDigits, maximumFractionDigits} = options;
  const meta = currencyMetadata[currency];
  const divisor = 10 ** meta.minorUnit;

  const amountMajor = amountMinor / divisor;

  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: minimumFractionDigits ?? meta.minorUnit,
    maximumFractionDigits: maximumFractionDigits ?? meta.minorUnit,
  }).format(amountMajor);
}

