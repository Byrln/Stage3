"use client";

import type {Tour} from "@prisma/client";
import {useLocale, useTranslations} from "next-intl";
import {Heart, Star, Users, Clock, Mountain} from "lucide-react";
import Link from "next/link";
import {formatCurrency} from "@/lib/currency";
import {useCurrency} from "./currency-context";

import {TourCard} from "./tour-card";

type FeaturedToursClientProps = {
  tours: Tour[];
};

export function FeaturedToursClient(props: FeaturedToursClientProps) {
  const {tours} = props;
  const t = useTranslations("public.tours");

  const featured = tours.slice(0, 6);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section id="tours" className="bg-white py-16 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-2xl tracking-tight sm:text-3xl">{t("title")}</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">{t("subtitle")}</p>
          </div>
          <div className="hidden items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 sm:flex">
            <button className="rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
              {t("tabAll")}
            </button>
            <button className="rounded-full border border-neutral-200 px-3 py-1 font-medium text-neutral-700 dark:border-neutral-800 dark:text-neutral-200">
              {t("tabAdventure")}
            </button>
            <button className="rounded-full border border-neutral-200 px-3 py-1 font-medium text-neutral-700 dark:border-neutral-800 dark:text-neutral-200">
              {t("tabCultural")}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}

