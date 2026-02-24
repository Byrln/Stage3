"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Menu,
  Search,
  ExternalLink,
  Coins,
  Globe2,
  SunMedium,
  Moon,
  Bell,
  Command,
} from "lucide-react";
import { sileo } from "sileo";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "@/lib/i18n";

const languageMap: Record<string, string> = {
  en: "English",
  zh: "中文 (Chinese)",
  ja: "日本語 (Japanese)",
  ko: "한국어 (Korean)",
  mn: "Монгол (Mongolian)",
  fr: "Français (French)",
  de: "Deutsch (German)",
  es: "Español (Spanish)",
  ar: "العربية (Arabic)",
  hi: "हिन्दी (Hindi)",
};

type DashboardHeaderProps = {
  tenant: {
    id: string;
    name: string;
    slug: string;
    defaultCurrency: string;
  };
  user: {
    id: string;
    name: string;
    role: string;
  };
  locale: string;
  notifications: Array<{
    id: string;
    type: string;
    read: boolean;
  }>;
  onMobileMenuClick: () => void;
};

export function DashboardHeader({
  tenant,
  user,
  locale,
  notifications,
  onMobileMenuClick,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const tDashboard = useTranslations("dashboard");
  const { setTheme, theme } = useTheme();
  const [currency, setCurrency] = useState(tenant.defaultCurrency || "USD");

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleLanguageChange(newLocale: string) {
    const segments = pathname.split("/");
    // segments[0] is empty, segments[1] is locale
    if (segments.length > 1) {
      segments[1] = newLocale;
      router.push(segments.join("/"));
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-[60px] flex-shrink-0 items-center gap-4 border-b border-border-subtle bg-bg-base/80 px-6 backdrop-blur-xl transition-all duration-300">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMobileMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search Bar */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-md transition-all duration-300 focus-within:scale-[1.02]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
          <Input
            type="search"
            placeholder={tDashboard("searchPlaceholder")}
            className="h-10 w-full rounded-xl border-border-subtle bg-bg-surface/50 pl-10 pr-12 text-sm shadow-sm transition-all duration-200 hover:bg-bg-surface focus:border-primary/50 focus:bg-bg-surface focus:ring-2 focus:ring-primary/20"
          />
          <div className="pointer-events-none absolute right-3 top-2.5 flex h-5 items-center gap-1 rounded border border-border-subtle bg-bg-elevated px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-60">
            <span className="text-xs">⌘</span>K
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Public Page Link */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild 
          title="View Public Site"
          className="h-9 w-9 rounded-full hover:bg-bg-elevated text-muted-foreground hover:text-primary transition-colors"
        >
          <Link href={`/${locale}`} target="_blank">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>

        {/* Currency Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-bg-elevated text-muted-foreground hover:text-primary transition-colors"
            >
              <Coins className="h-4 w-4" />
              <span className="sr-only">Currency</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border-subtle bg-bg-surface p-1 shadow-lg backdrop-blur-sm">
            <DropdownMenuLabel className="text-xs font-semibold uppercase text-muted-foreground px-2 py-1.5">Currency</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border-subtle" />
            {["USD", "EUR", "GBP", "JPY", "AUD"].map((c) => (
              <DropdownMenuItem
                key={c}
                onClick={() => {
                  setCurrency(c);
                  sileo.info({
                    title: "Currency changed",
                    description: `Display currency updated to ${c} (Simulation).`,
                  });
                }}
                className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer"
              >
                <span className={cn("mr-2 flex h-4 w-4 items-center justify-center font-bold text-xs", currency === c && "text-primary")}>
                  {currency === c && "✓"}
                </span>
                {c}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-bg-elevated text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe2 className="h-4 w-4" />
              <span className="sr-only">Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border-subtle bg-bg-surface p-1 shadow-lg backdrop-blur-sm">
            <DropdownMenuLabel className="text-xs font-semibold uppercase text-muted-foreground px-2 py-1.5">Language</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border-subtle" />
            {locales.map((l) => (
              <DropdownMenuItem
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={cn(
                  "rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer",
                  locale === l && "bg-primary/5 text-primary font-medium"
                )}
              >
                <span className={cn("mr-2 flex h-4 w-4 items-center justify-center font-bold text-xs", locale === l && "text-primary")}>
                  {locale === l && "✓"}
                </span>
                {languageMap[l] || l}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-bg-elevated text-muted-foreground hover:text-amber-400 dark:hover:text-purple-400 transition-colors"
            >
              <SunMedium className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-xl border-border-subtle bg-bg-surface p-1 shadow-lg backdrop-blur-sm">
            <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-lg focus:bg-amber-500/10 focus:text-amber-600 cursor-pointer">
              <SunMedium className="mr-2 h-4 w-4" /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-lg focus:bg-purple-500/10 focus:text-purple-400 cursor-pointer">
              <Moon className="mr-2 h-4 w-4" /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer">
              <span className="mr-2 h-4 w-4 flex items-center justify-center font-bold text-xs">💻</span> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 rounded-full hover:bg-bg-elevated text-muted-foreground hover:text-destructive transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-bg-base bg-destructive shadow-[0_0_8px_rgba(var(--destructive),0.6)]" />
          )}
        </Button>
      </div>
    </header>
  );
}
