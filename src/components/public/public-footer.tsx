"use client";

import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter} from "next/navigation";
import {useCurrency} from "./currency-context";

type PublicFooterProps = {
  tenantName: string;
};

export function PublicFooter(props: PublicFooterProps) {
  const {tenantName} = props;
  const t = useTranslations("public.footer");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const {currency, setCurrency} = useCurrency();

  function handleLocaleChange(nextLocale: string) {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      router.push(`/${nextLocale}`);
      return;
    }

    segments[0] = nextLocale;
    router.push(`/${segments.join("/")}`);
  }

  return (
    <footer id="contact" className="bg-neutral-950 py-12 text-neutral-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-neutral-800 pb-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white shadow-sm">
                <span>{tenantName.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-base tracking-tight text-neutral-50">
                  {tenantName}
                </span>
                <span className="text-[11px] text-neutral-400">{t("tagline")}</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400">{t("description")}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {t("quickLinks")}
            </h3>
            <div className="space-y-2 text-sm text-neutral-300">
              <a href="#tours" className="block hover:text-emerald-300">
                {t("linkTours")}
              </a>
              <a href="#destinations" className="block hover:text-emerald-300">
                {t("linkDestinations")}
              </a>
              <a href="#about" className="block hover:text-emerald-300">
                {t("linkAbout")}
              </a>
              <a href="#contact" className="block hover:text-emerald-300">
                {t("linkContact")}
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {t("destinationsTitle")}
            </h3>
            <div className="space-y-2 text-sm text-neutral-300">
              <p>Gobi Desert, Mongolia</p>
              <p>Bhutan Dzongs, Bhutan</p>
              <p>Himalayas, Nepal</p>
              <p>Mekong Delta, Vietnam</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {t("contactTitle")}
            </h3>
            <div className="space-y-2 text-sm text-neutral-300">
              <p>{t("contactEmail")}</p>
              <p>{t("contactPhone")}</p>
            </div>
            <div className="space-y-2 text-xs text-neutral-400">
              <p>{t("paymentsTitle")}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-1">
                  <span className="h-2 w-4 rounded bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />
                </span>
                <span className="inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-1 text-[10px]">
                  VISA
                </span>
                <span className="inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-1 text-[10px]">
                  MasterCard
                </span>
                <span className="inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-1 text-[10px]">
                  Amex
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 text-[11px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              © {new Date().getFullYear()} {tenantName}. {t("rights")}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5">
              <span className="text-xs text-neutral-400">{t("languageLabel")}</span>
              <select
                className="bg-transparent text-xs font-medium text-neutral-100 outline-none"
                value={locale}
                onChange={(event) => handleLocaleChange(event.target.value)}
              >
                <option value="en">EN</option>
                <option value="zh">中文</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5">
              <span className="text-xs text-neutral-400">{t("currencyLabel")}</span>
              <select
                className="bg-transparent text-xs font-medium text-neutral-100 outline-none"
                value={currency}
                onChange={(event) => setCurrency(event.target.value as any)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

