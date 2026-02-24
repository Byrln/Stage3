import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {getCustomerWithBookings} from "@/lib/db/queries/customers";
import {locales, type AppLocale} from "@/lib/i18n";
import type {SupportedCurrency} from "@/lib/currency";
import {CustomerDetailClient} from "@/components/dashboard/customers/customer-detail-client";

export const metadata: Metadata = {
  title: "Customer detail - Tripsaas",
};

type CustomerDetailPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function CustomerDetailPage(props: CustomerDetailPageProps) {
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

  const customer = await getCustomerWithBookings(tenant.id, id);

  if (!customer) {
    notFound();
  }

  const fullName = `${customer.firstName} ${customer.lastName}`.trim();

  const detail = {
    id: customer.id,
    fullName,
    email: customer.email,
    phone: customer.phone ?? "",
    nationality: customer.nationality ?? "",
    dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.toISOString() : null,
    passportNumber: customer.passportNumber ?? "",
    passportExpiry: customer.passportExpiry ? customer.passportExpiry.toISOString() : null,
    preferredLanguage: customer.preferredLanguage ?? "",
    preferredCurrency: (customer.preferredCurrency ||
      tenant.defaultCurrency) as SupportedCurrency,
    totalBookings: customer.totalBookings,
    totalSpent: customer.totalSpent,
    tags: customer.tags,
    notes: customer.notes ?? "",
    marketingConsent: customer.marketingConsent,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
    bookings: customer.bookings.map((booking) => ({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      status: booking.status,
      totalPrice: booking.totalPrice,
      currency: booking.currency as SupportedCurrency,
    })),
  };

  return (
    <main className="space-y-4">
      <CustomerDetailClient
        locale={locale}
        tenantDefaultCurrency={tenant.defaultCurrency as SupportedCurrency}
        customer={detail}
      />
    </main>
  );
}

