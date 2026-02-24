"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useLocale, useTranslations} from "next-intl";
import {Menu, X, Globe2, Moon, SunMedium} from "lucide-react";
import {useCurrency} from "./currency-context";

type PublicNavbarProps = {
  tenantName: string;
  tenantLogoUrl?: string | null;
};

export function PublicNavbar(props: PublicNavbarProps) {
  const {tenantName, tenantLogoUrl} = props;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const {currency, setCurrency} = useCurrency();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const tNav = useTranslations("nav");

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 32);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  function handleLocaleChange(nextLocale: string) {
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = nextLocale;
    router.push(`/${segments.join("/")}`);
  }

  const navBg = isScrolled ? "bg-white/90 dark:bg-neutral-950/90 shadow-sm" : "bg-transparent";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b border-transparent backdrop-blur-md transition-colors ${navBg}`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-600 text-sm font-semibold text-white shadow-sm">
              {tenantLogoUrl ? (
                <img src={tenantLogoUrl} alt={tenantName} className="h-full w-full object-cover" />
              ) : (
                <span>{tenantName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="font-heading text-base tracking-tight">{tenantName}</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Asia journeys</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-700 dark:text-neutral-100 md:flex">
            <a href="#tours" className="hover:text-primary-600 dark:hover:text-primary-400">
              {tNav("tours")}
            </a>
            <a href="#destinations" className="hover:text-primary-600 dark:hover:text-primary-400">
              Destinations
            </a>
            <a href="#about" className="hover:text-primary-600 dark:hover:text-primary-400">
              About
            </a>
            <a href="#contact" className="hover:text-primary-600 dark:hover:text-primary-400">
              {tNav("contact")}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <div className="relative">
                <button className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <Globe2 className="h-3.5 w-3.5" />
                  <span className="uppercase">{locale}</span>
                </button>
                <div className="hidden" />
              </div>
              <select
                className="h-8 rounded-full border border-neutral-200 bg-white px-2 text-xs font-medium text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                aria-label="Currency"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
              </select>
            </div>

            <button
              type="button"
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 md:inline-flex"
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {darkMode ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              className="hidden rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800 md:inline-flex"
              onClick={() => router.push(`/${locale}/auth/login`)}
            >
              {tNav("login")}
            </button>
            <button
              type="button"
              className="hidden rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/30 hover:bg-primary-500 md:inline-flex"
              onClick={() => router.push(`/${locale}/tours`)}
            >
              Book now
            </button>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800 md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm md:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-600 text-sm font-semibold text-white shadow-sm">
                  {tenantLogoUrl ? (
                    <img src={tenantLogoUrl} alt={tenantName} className="h-full w-full object-cover" />
                  ) : (
                    <span>{tenantName.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <span className="font-heading text-base tracking-tight text-neutral-50">{tenantName}</span>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-200"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 flex flex-1 flex-col gap-6 px-6 text-lg font-medium text-neutral-50">
              <button
                type="button"
                className="text-left"
                onClick={() => {
                  setMobileOpen(false);
                  document.getElementById("tours")?.scrollIntoView({behavior: "smooth"});
                }}
              >
                {tNav("tours")}
              </button>
              <button
                type="button"
                className="text-left"
                onClick={() => {
                  setMobileOpen(false);
                  document.getElementById("destinations")?.scrollIntoView({behavior: "smooth"});
                }}
              >
                Destinations
              </button>
              <button
                type="button"
                className="text-left"
                onClick={() => {
                  setMobileOpen(false);
                  document.getElementById("about")?.scrollIntoView({behavior: "smooth"});
                }}
              >
                About
              </button>
              <button
                type="button"
                className="text-left"
                onClick={() => {
                  setMobileOpen(false);
                  document.getElementById("contact")?.scrollIntoView({behavior: "smooth"});
                }}
              >
                {tNav("contact")}
              </button>
            </div>
            <div className="space-y-4 px-6 pb-10 pt-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-medium text-neutral-100"
                >
                  <Globe2 className="h-3.5 w-3.5" />
                  <span className="uppercase">{locale}</span>
                </button>
                <select
                  className="h-9 flex-1 rounded-full border border-neutral-800 bg-neutral-900 px-3 text-xs font-medium text-neutral-100"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  aria-label="Currency"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="CNY">CNY</option>
                </select>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-100"
                  aria-label="Toggle dark mode"
                  onClick={() => setDarkMode((prev) => !prev)}
                >
                  {darkMode ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-neutral-50"
                onClick={() => {
                  setMobileOpen(false);
                  router.push(`/${locale}/auth/login`);
                }}
              >
                {tNav("login")}
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30"
                onClick={() => {
                  setMobileOpen(false);
                  router.push(`/${locale}/tours`);
                }}
              >
                Book now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

