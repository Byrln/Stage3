import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {getVendorById} from "@/lib/db/queries/vendors";
import {locales, type AppLocale} from "@/lib/i18n";
import {VendorDetailClient} from "@/components/dashboard/vendors/vendor-detail-client";

export const metadata: Metadata = {
  title: "Vendor detail - Tripsaas",
};

type VendorDetailPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function VendorDetailPage(props: VendorDetailPageProps) {
  const {params} = props;
  const {locale, id} = await params;

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

  const vendor = await getVendorById(tenant.id, id);

  if (!vendor) {
    notFound();
  }

  const detail = {
    id: vendor.id,
    name: vendor.name,
    type: vendor.type,
    email: vendor.email ?? "",
    phone: vendor.phone ?? "",
    website: vendor.website ?? "",
    address: vendor.address ?? "",
    description: vendor.description ?? "",
    rating: vendor.rating ?? 0,
    contractUrl: vendor.contractUrl ?? "",
    contractExpiry: vendor.contractExpiry ? vendor.contractExpiry.toISOString() : null,
    commissionRate: vendor.commissionRate,
    notes: vendor.notes ?? "",
    isActive: vendor.isActive,
    country: tenant.country ?? "",
    tours: vendor.tourVendors.map((tv) => ({
      id: tv.tour.id,
      title: tv.tour.title,
    })),
  };

  return (
    <main className="space-y-4">
      <VendorDetailClient locale={locale} vendor={detail} />
    </main>
  );
}

