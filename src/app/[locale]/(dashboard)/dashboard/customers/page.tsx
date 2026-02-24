import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {getCustomers} from "@/lib/db/queries/customers";
import {locales, type AppLocale} from "@/lib/i18n";
import type {SupportedCurrency} from "@/lib/currency";
import {CustomersListClient} from "@/components/dashboard/customers/customers-list-client";

export const metadata: Metadata = {
  title: "Customers - Tripsaas",
};

type CustomersPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CustomersPage(props: CustomersPageProps) {
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

  const customers = await getCustomers(tenant.id);

  const rows = customers.map((customer) => ({
    id: customer.id,
    fullName: `${customer.firstName} ${customer.lastName}`.trim(),
    email: customer.email,
    phone: customer.phone ?? "",
    nationality: customer.nationality ?? "",
    totalBookings: customer.totalBookings,
    totalSpent: customer.totalSpent,
    preferredCurrency: (customer.preferredCurrency || tenant.defaultCurrency) as SupportedCurrency,
    tags: customer.tags,
    lastActivity: customer.updatedAt.toISOString(),
  }));

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">Customers</h1>
          <p className="mt-1 text-xs text-neutral-400">
            CRM view of all travelers, their bookings, and value.
          </p>
        </div>
      </header>

      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
        <CustomersListClient
          locale={locale}
          tenantDefaultCurrency={tenant.defaultCurrency as SupportedCurrency}
          customers={rows}
        />
      </section>
    </main>
  );
}

