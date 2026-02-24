import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {locales, type AppLocale} from "@/lib/i18n";
import {SettingsDashboardClient} from "@/components/dashboard/settings/settings-dashboard-client";

export const metadata: Metadata = {
  title: "Settings - Tripsaas",
};

type SettingsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SettingsPage(props: SettingsPageProps) {
  const {params} = props;
  const {locale} = await params;

  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  await requireAuth();

  const tenantContext = await getCurrentTenant();

  if (!tenantContext) {
    notFound();
  }

  const tenant = await getTenantBySlug(tenantContext.slug);

  if (!tenant) {
    notFound();
  }

  const settings = tenant.settings as Record<string, unknown> | null;
  const socialLinks = tenant.socialLinks as Record<string, string> | null;

  return (
    <main className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">
            Workspace settings
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Configure branding, localization, bookings, emails, payments, and integrations.
          </p>
        </div>
      </header>

      <SettingsDashboardClient
        locale={locale}
        tenant={{
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          logoUrl: tenant.logoUrl ?? "",
          coverImageUrl: tenant.coverImageUrl ?? "",
          description: tenant.description ?? "",
          primaryColor: tenant.primaryColor ?? "#16a34a",
          accentColor: tenant.accentColor ?? "#22c55e",
          defaultCurrency: tenant.defaultCurrency,
          supportedCurrencies: tenant.supportedCurrencies,
          defaultLocale: tenant.defaultLocale,
          supportedLocales: tenant.supportedLocales,
          contactEmail: tenant.contactEmail,
          contactPhone: tenant.contactPhone ?? "",
          address: tenant.address ?? "",
          country: tenant.country ?? "",
          socialLinks: socialLinks ?? {},
          rawSettings: settings ?? {},
        }}
      />
    </main>
  );
}

