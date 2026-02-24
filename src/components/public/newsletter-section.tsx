"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {sileo} from "sileo";

export function NewsletterSection() {
  const t = useTranslations("public.newsletter");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!email) {
      sileo.error({
        title: t("errorTitle"),
        description: t("errorDescription"),
      });

      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      sileo.success({
        title: t("successTitle"),
        description: t("successDescription"),
      });
      setEmail("");
    } catch {
      sileo.error({
        title: t("errorTitle"),
        description: t("errorDescription"),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-sky-500 py-14 text-neutral-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-950/10 p-8 shadow-xl shadow-emerald-900/40 backdrop-blur-md sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-50/80">
                {t("eyebrow")}
              </p>
              <h2 className="mt-3 font-heading text-2xl tracking-tight sm:text-3xl">{t("title")}</h2>
              <p className="mt-2 text-sm text-emerald-50/90">{t("subtitle")}</p>
            </div>
            <form
              className="w-full max-w-md space-y-3 sm:space-y-2"
              onSubmit={handleSubmit}
            >
              <label className="sr-only" htmlFor="newsletter-email">
                {t("label")}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("placeholder")}
                  className="h-10 flex-1 rounded-full border border-emerald-100/70 bg-emerald-50/20 px-4 text-sm text-neutral-900 placeholder:text-emerald-50/80 shadow-sm outline-none ring-emerald-300/60 backdrop-blur focus:border-white focus:bg-white/90 focus:ring-2"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-emerald-50 shadow-lg shadow-emerald-900/50 transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
                >
                  {isSubmitting ? t("submitting") : t("cta")}
                </button>
              </div>
              <p className="text-[11px] text-emerald-50/80">{t("disclaimer")}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

