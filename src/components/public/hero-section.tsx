"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useLocale, useTranslations} from "next-intl";
import {motion} from "framer-motion";

type HeroSectionProps = {
  tenantName: string;
};

const destinations = [
  {value: "mongolia", label: "🇲🇳 Mongolia"},
  {value: "bhutan", label: "🇧🇹 Bhutan"},
  {value: "vietnam", label: "🇻🇳 Vietnam"},
  {value: "tibet", label: "🇨🇳 Tibet"},
  {value: "nepal", label: "🇳🇵 Nepal"},
  {value: "kyrgyzstan", label: "🇰🇬 Kyrgyzstan"},
  {value: "japan", label: "🇯🇵 Japan"},
  {value: "cambodia", label: "🇰🇭 Cambodia"},
  {value: "myanmar", label: "🇲🇲 Myanmar"},
  {value: "laos", label: "🇱🇦 Laos"},
  {value: "thailand", label: "🇹🇭 Thailand"},
  {value: "india", label: "🇮🇳 India"},
];

const tourTypes = ["adventure", "cultural", "beach", "wildlife", "photography"] as const;

type TourType = (typeof tourTypes)[number];

export function HeroSection(props: HeroSectionProps) {
  const {tenantName} = props;
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const t = useTranslations("public.hero");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [destination, setDestination] = useState(destinations[0]?.value ?? "");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [type, setType] = useState<TourType>("adventure");

  const backgroundImages = useMemo(
    () => [
      "/images/asia-hero-1.jpg",
      "/images/asia-hero-2.jpg",
      "/images/asia-hero-3.jpg",
      "/images/asia-hero-4.jpg",
      "/images/asia-hero-5.jpg",
    ],
    [],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [backgroundImages.length]);

  function handleSearch() {
    const next = new URLSearchParams(searchParams.toString());

    if (destination) next.set("destination", destination);
    if (dateFrom) next.set("from", dateFrom);
    if (dateTo) next.set("to", dateTo);
    if (adults) next.set("adults", String(adults));
    if (children) next.set("children", String(children));
    if (type) next.set("type", type);

    router.push(`/${locale}/tours?${next.toString()}`);
  }

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-neutral-950 text-neutral-50">
      <div className="pointer-events-none absolute inset-0">
        {backgroundImages.map((src, index) => (
          <motion.div
            key={src}
            className="absolute inset-0 bg-cover bg-center"
            style={{backgroundImage: `url(${src})`}}
            initial={{opacity: 0, scale: 1.02, y: 0}}
            animate={{
              opacity: index === activeImageIndex ? 1 : 0,
              scale: index === activeImageIndex ? 1 : 1.04,
            }}
            transition={{duration: 1.6, ease: "easeOut"}}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/30" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-28 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8">
        <div className="max-w-xl space-y-8">
          <motion.p
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200 ring-1 ring-emerald-400/40"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1, duration: 0.4}}
          >
            {tenantName} · {t("badge")}
          </motion.p>

          <motion.h1
            className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {t("headline")
              .split(" ")
              .map((word) => (
                <motion.span
                  key={word + Math.random()}
                  className="inline-block"
                  variants={{
                    hidden: {opacity: 0, y: 12},
                    visible: {opacity: 1, y: 0},
                  }}
                  transition={{duration: 0.45, ease: "easeOut"}}
                >
                  {word}{" "}
                </motion.span>
              ))}
          </motion.h1>

          <motion.p
            className="max-w-lg text-sm leading-relaxed text-neutral-200 sm:text-base"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.7, duration: 0.45}}
          >
            {t("subheadline")}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 text-xs text-neutral-200"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.9, duration: 0.4}}
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900/70 px-3 py-1 ring-1 ring-neutral-700/80">
              500+ happy travelers
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900/70 px-3 py-1 ring-1 ring-neutral-700/80">
              4.9★ average rating
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900/70 px-3 py-1 ring-1 ring-neutral-700/80">
              10+ years in Asia
            </span>
          </motion.div>
        </div>

        <motion.div
          className="relative mt-4 w-full max-w-md lg:mt-0"
          initial={{opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 1.1, duration: 0.5}}
        >
          <div className="pointer-events-none absolute -left-16 -top-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="relative rounded-3xl bg-neutral-900/80 p-5 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-neutral-50">{t("searchTitle")}</h2>
              <span className="text-[11px] text-neutral-400">{t("searchSubtitle")}</span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-neutral-300">{t("destination")}</label>
                <select
                  className="h-9 w-full rounded-2xl border border-neutral-700 bg-neutral-950/60 px-3 text-xs text-neutral-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  {destinations.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-neutral-300">{t("from")}</label>
                  <input
                    type="date"
                    className="h-9 w-full rounded-2xl border border-neutral-700 bg-neutral-950/60 px-3 text-xs text-neutral-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-neutral-300">{t("to")}</label>
                  <input
                    type="date"
                    className="h-9 w-full rounded-2xl border border-neutral-700 bg-neutral-950/60 px-3 text-xs text-neutral-50 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-neutral-300">{t("adults")}</label>
                  <div className="flex items-center justify-between rounded-2xl border border-neutral-700 bg-neutral-950/60 px-3 py-1">
                    <button
                      type="button"
                      className="h-6 w-6 rounded-full bg-neutral-800 text-sm"
                      onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                      aria-label="Decrease adults"
                    >
                      −
                    </button>
                    <span className="text-xs text-neutral-50">{adults}</span>
                    <button
                      type="button"
                      className="h-6 w-6 rounded-full bg-neutral-800 text-sm"
                      onClick={() => setAdults((prev) => prev + 1)}
                      aria-label="Increase adults"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-neutral-300">{t("children")}</label>
                  <div className="flex items-center justify-between rounded-2xl border border-neutral-700 bg-neutral-950/60 px-3 py-1">
                    <button
                      type="button"
                      className="h-6 w-6 rounded-full bg-neutral-800 text-sm"
                      onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                      aria-label="Decrease children"
                    >
                      −
                    </button>
                    <span className="text-xs text-neutral-50">{children}</span>
                    <button
                      type="button"
                      className="h-6 w-6 rounded-full bg-neutral-800 text-sm"
                      onClick={() => setChildren((prev) => prev + 1)}
                      aria-label="Increase children"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-neutral-300">{t("type")}</label>
                <div className="flex flex-wrap gap-2">
                  {tourTypes.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`rounded-full px-3 py-1 text-[11px] font-medium capitalize ${
                        type === value
                          ? "bg-emerald-500 text-neutral-950"
                          : "bg-neutral-900 text-neutral-200 ring-1 ring-neutral-700"
                      }`}
                      onClick={() => setType(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                onClick={handleSearch}
              >
                {t("searchCta")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-xs text-neutral-200"
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 1.2, duration: 0.5}}
      >
        <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-neutral-300">{t("scrollHint")}</div>
        <div className="mx-auto flex h-10 w-6 items-center justify-center rounded-full border border-neutral-500/60">
          <motion.div
            className="h-2 w-0.5 rounded-full bg-neutral-200"
            animate={{y: [0, 6, 0], opacity: [1, 0.2, 1]}}
            transition={{repeat: Infinity, duration: 1.2}}
          />
        </div>
      </motion.div>
    </section>
  );
}

