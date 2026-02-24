import type {Metadata} from "next";
import {headers} from "next/headers";
import type {SupportedCurrency} from "@/lib/currency";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {CurrencyProvider} from "@/components/public/currency-context";
import {PublicNavbar} from "@/components/public/public-navbar";
import {HeroSection} from "@/components/public/hero-section";
import {FeaturedTours} from "@/components/public/featured-tours";
import {FeaturedDestinations} from "@/components/public/featured-destinations";
import {TourCategories} from "@/components/public/tour-categories";
import {WhyChooseUs} from "@/components/public/why-choose-us";
import {TestimonialsCarousel} from "@/components/public/testimonials-carousel";
import {InteractiveMap} from "@/components/public/interactive-map";
import {NewsletterSection} from "@/components/public/newsletter-section";
import {PublicFooter} from "@/components/public/public-footer";

export const metadata: Metadata = {
  title: "Tripsaas",
};

export default async function LocaleHomePage() {
  const headersList = await headers();
  const tenantSlug = headersList.get("x-tenant-slug");

  if (!tenantSlug) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0fbfc,_transparent_60%),linear-gradient(to_bottom,_var(--background),_#f8f4e3)] text-neutral-900 dark:text-neutral-50">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white shadow-sm">
                TS
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg tracking-tight">Tripsaas</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Multi-tenant travel platform</span>
              </div>
            </div>
          </header>

          <section className="mt-16 grid flex-1 gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/40 dark:text-emerald-100">
                  Built for multi-tenant tour operators
                </p>
                <h1 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Travel SaaS for multi-tenant tour operators
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Launch branded booking experiences for every market without engineering bottlenecks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50">
                  Start free trial
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800">
                  Book a demo
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-medium uppercase tracking-wide">Trusted by modern adventure brands</span>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 blur-3xl">
                <div className="mx-auto h-64 max-w-md rounded-full bg-gradient-to-tr from-emerald-400/70 via-sky-300/40 to-amber-300/60 opacity-70" />
              </div>
              <div className="relative mt-6">
                <div className="rounded-3xl border border-neutral-200/80 bg-white/80 p-4 shadow-2xl shadow-emerald-500/10 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/80">
                  <div className="flex items-center justify-between gap-4 border-b border-dashed border-neutral-200 pb-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <span>Workspace</span>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                      demo.tripsaas.com
                    </span>
                  </div>
                  <div className="mt-4 space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">Active trips</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-50">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">Monthly revenue</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-300">$128,430</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 dark:text-neutral-400">Occupancy</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-50">86%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const tenant = await getTenantBySlug(tenantSlug);

  if (!tenant) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0fbfc,_transparent_60%),linear-gradient(to_bottom,_var(--background),_#f8f4e3)] text-neutral-900 dark:text-neutral-50">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white shadow-sm">
                TS
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg tracking-tight">Tripsaas</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Multi-tenant travel platform</span>
              </div>
            </div>
          </header>
        </div>
      </main>
    );
  }

  const tenantName = tenant.name;
  const defaultCurrency = tenant.defaultCurrency as SupportedCurrency;

  return (
    <main className=" bg-neutral-950 text-neutral-50">
      <CurrencyProvider defaultCurrency={defaultCurrency}>
        <PublicNavbar tenantName={tenantName} tenantLogoUrl={null} />
        <HeroSection tenantName={tenantName} />
        <FeaturedTours />
        <FeaturedDestinations />
        <TourCategories />
        <WhyChooseUs />
        <TestimonialsCarousel />
        <InteractiveMap />
        <NewsletterSection />
        <PublicFooter tenantName={tenantName} />
      </CurrencyProvider>
    </main>
  );
}
