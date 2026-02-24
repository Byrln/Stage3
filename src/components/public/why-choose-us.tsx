"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {Headphones, Map, ShieldCheck, Users} from "lucide-react";

type MetricCardProps = {
  label: string;
  icon: "guides" | "groups" | "support" | "guarantee";
  target: number;
  suffix: string;
};

function MetricCard(props: MetricCardProps) {
  const {label, icon, target, suffix} = props;
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      const [entry] = entries;

      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
      }
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.4,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 900;
    const steps = 30;
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const id = window.setInterval(() => {
      current += increment;

      if (current >= target) {
        setValue(target);
        window.clearInterval(id);
      } else {
        setValue(Math.round(current));
      }
    }, stepDuration);

    return () => window.clearInterval(id);
  }, [hasAnimated, target]);

  const Icon =
    icon === "guides" ? Map : icon === "groups" ? Users : icon === "support" ? Headphones : ShieldCheck;

  return (
    <div
      ref={ref}
      className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm shadow-neutral-200/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:shadow-none"
    >
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        {value}
        {suffix}
      </div>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">{label}</p>
    </div>
  );
}

export function WhyChooseUs() {
  const t = useTranslations("public.whyUs");

  return (
    <section id="about" className="bg-neutral-50 py-16 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-2xl tracking-tight sm:text-3xl">{t("title")}</h2>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{t("body")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label={t("guides")} icon="guides" target={120} suffix="+" />
            <MetricCard label={t("groups")} icon="groups" target={500} suffix="+" />
            <MetricCard label={t("support")} icon="support" target={24} suffix="/7" />
            <MetricCard label={t("guarantee")} icon="guarantee" target={98} suffix="%" />
          </div>
        </div>
      </div>
    </section>
  );
}

