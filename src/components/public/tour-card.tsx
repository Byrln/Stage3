'use client';

import type {Tour} from "@prisma/client";
import {useLocale, useTranslations} from "next-intl";
import {Heart, Star, Users, Clock, Mountain} from "lucide-react";
import Link from "next/link";
import {formatCurrency} from "@/lib/currency";
import {useCurrency} from "./currency-context";

type TourCardProps = {
  tour: Tour;
};

export function TourCard({tour}: TourCardProps) {
  const locale = useLocale();
  const t = useTranslations("public.tours");
  const {currency} = useCurrency();

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-50 shadow-sm shadow-neutral-200/60 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-300/70 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={tour.imageUrls[0] ?? "/images/tours/placeholder.jpg"}
          alt={tour.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-neutral-950 shadow-md shadow-emerald-500/40">
          {t("badgeBestseller")}
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950/60 text-white shadow-md shadow-neutral-900/60 backdrop-blur-md"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{tour.title}</h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {tour.shortDescription}
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              <span className="font-semibold">{tour.rating?.toFixed(1) ?? "4.8"}</span>
            </div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {tour.reviewCount} {t("reviews")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {tour.duration} {t("days")}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{tour.maxGroupSize ?? 12} {t("guests")}</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-1">
            <Mountain className="h-3.5 w-3.5" />
            <span className="capitalize text-[11px]">{tour.difficulty.toLowerCase()}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {t("from")}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-semibold">
                {formatCurrency(tour.price, currency, locale)}
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {t("perPerson")}
              </span>
            </div>
          </div>
          <Link
            href={`/${locale}/tours/${tour.slug}`}
            className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm transition group-hover:bg-neutral-900 group-hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:group-hover:bg-neutral-50 dark:group-hover:text-neutral-900"
          >
            {t("viewDetails")}
          </Link>
        </div>
      </div>
    </article>
  );
}
