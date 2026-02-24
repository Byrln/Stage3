"use client";

import {useTranslations} from "next-intl";

type CategoryKey = "adventure" | "cultural" | "beach" | "wildlife" | "photography" | "culinary";

type Category = {
  key: CategoryKey;
  icon: string;
  toursCount: number;
};

const CATEGORIES: Category[] = [
  {key: "adventure", icon: "🏔️", toursCount: 32},
  {key: "cultural", icon: "🏛️", toursCount: 24},
  {key: "beach", icon: "🏖️", toursCount: 18},
  {key: "wildlife", icon: "🦁", toursCount: 14},
  {key: "photography", icon: "📸", toursCount: 20},
  {key: "culinary", icon: "🍜", toursCount: 12},
];

export function TourCategories() {
  const t = useTranslations("public.categories");

  return (
    <section className="bg-gradient-to-b from-emerald-900 via-emerald-950 to-neutral-950 py-16 text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-2xl tracking-tight sm:text-3xl">{t("title")}</h2>
            <p className="mt-2 max-w-xl text-sm text-emerald-100/80">{t("subtitle")}</p>
          </div>
          <p className="text-xs text-emerald-200/80">{t("hint")}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <div
              key={category.key}
              className="group relative h-40 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800/80 via-emerald-900/90 to-neutral-950/90 p-[1px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.5),_transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex h-full w-full items-stretch rounded-[1.4rem] bg-neutral-950/90">
                <div className="relative flex h-full w-full [transform-style:preserve-3d] [transition:transform_0.6s] group-hover:[transform:rotateY(180deg)]">
                  <div className="flex w-full flex-col justify-between p-4 [backface-visibility:hidden]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/15 text-lg">
                        <span>{category.icon}</span>
                      </div>
                      <span className="rounded-full bg-neutral-900/80 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                        {category.toursCount} {t("toursLabel")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">
                        {t(`${category.key}.title`)}
                      </h3>
                      <p className="mt-1 text-xs text-emerald-100/80">
                        {t(`${category.key}.caption`)}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-between rounded-[1.4rem] bg-neutral-950/95 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                        {t("backLabel")}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                        {category.toursCount}+ {t("toursShort")}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-neutral-200">
                      {t(`${category.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

