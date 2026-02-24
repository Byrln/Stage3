import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {DashboardOverviewClient} from "@/components/dashboard/dashboard-overview-client";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import type {SupportedCurrency} from "@/lib/currency";
import {locales, type AppLocale} from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Dashboard - Tripsaas",
};

type DashboardPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardPage(props: DashboardPageProps) {
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

  const overview = await import("@/lib/dashboard/overview").then((mod) =>
    mod.getDashboardOverviewData(tenant.id),
  );

  await getTranslations({locale, namespace: "dashboard"});

  return (
    <DashboardOverviewClient
      overview={overview}
      tenantCurrency={tenant.defaultCurrency as SupportedCurrency}
      locale={locale}
    />
  );
}

