import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {getDashboardOverviewData} from "@/lib/dashboard/overview";
import {locales, type AppLocale} from "@/lib/i18n";
import type {SupportedCurrency} from "@/lib/currency";
import {ReportsDashboardClient} from "@/components/dashboard/reports/reports-dashboard-client";

export const metadata: Metadata = {
  title: "Reports - Tripsaas",
};

type ReportsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ReportsPage(props: ReportsPageProps) {
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

  const overview = await getDashboardOverviewData(tenant.id);

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">Reports</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Generate, preview, and export operational and financial reports.
          </p>
        </div>
      </header>

      <ReportsDashboardClient
        locale={locale}
        tenantCurrency={tenant.defaultCurrency as SupportedCurrency}
        overview={overview}
      />
    </main>
  );
}

