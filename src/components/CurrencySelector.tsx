import type {CurrencyCode} from "@/lib/currencies";
import {currencyMetadata} from "@/lib/currencies";

type CurrencySelectorProps = {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
};

export function CurrencySelector(props: CurrencySelectorProps) {
  const {value, onChange} = props;

  return (
    <select
      value={value}
      onChange={(event) => {
        onChange(event.target.value as CurrencyCode);
      }}
      className="inline-flex h-9 items-center rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
    >
      {(Object.entries(currencyMetadata) as [CurrencyCode, (typeof currencyMetadata)[CurrencyCode]][]).map(
        ([code, meta]) => (
          <option key={code} value={code}>
            {meta.symbol} {code} · {meta.label}
          </option>
        ),
      )}
    </select>
  );
}

