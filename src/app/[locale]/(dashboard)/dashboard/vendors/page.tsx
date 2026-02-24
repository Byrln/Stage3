import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {getVendors} from "@/lib/db/queries/vendors";
import {locales, type AppLocale} from "@/lib/i18n";
import {VendorsListClient} from "@/components/dashboard/vendors/vendors-list-client";

export const metadata: Metadata = {
  title: "Vendors - Tripsaas",
};

type VendorsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function VendorsPage(props: VendorsPageProps) {
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

  const vendors = await getVendors(tenant.id);

  const rows = vendors.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    type: vendor.type,
    email: vendor.email ?? "",
    phone: vendor.phone ?? "",
    website: vendor.website ?? "",
    address: vendor.address ?? "",
    rating: vendor.rating ?? 0,
    contractExpiry: vendor.contractExpiry ? vendor.contractExpiry.toISOString() : null,
    commissionRate: vendor.commissionRate,
    isActive: vendor.isActive,
    country: tenant.country ?? "",
    activeToursCount: vendor.tourVendors.length,
  }));

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">Vendors</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Manage hotels, transport providers, guides, and other partners.
          </p>
        </div>
      </header>

      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
        <VendorsListClient locale={locale} vendors={rows} />
      </section>
    </main>
  );
}

