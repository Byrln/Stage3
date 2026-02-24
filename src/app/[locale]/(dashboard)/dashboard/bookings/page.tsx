import type {Metadata} from "next";
import {notFound} from "next/navigation";
import type {BookingStatus} from "@prisma/client";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {getBookings} from "@/lib/db/queries/bookings";
import {locales, type AppLocale} from "@/lib/i18n";
import type {SupportedCurrency} from "@/lib/currency";
import {BookingsListClient} from "@/components/dashboard/bookings/bookings-list-client";

export const metadata: Metadata = {
  title: "Bookings - Tripsaas",
};

type BookingsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function BookingsPage(props: BookingsPageProps) {
  const {params} = props;
  const {locale} = await params;

  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  const session = await requireAuth();
  const tenantContext = await getCurrentTenant();

  if (!tenantContext) {
    notFound();
  }

  const tenant = await getTenantBySlug(tenantContext.slug);

  if (!tenant) {
    notFound();
  }

  const bookings = await getBookings(tenant.id);

  const rows = bookings.map((booking) => ({
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    customerName: booking.customer
      ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim()
      : "",
    customerAvatar: null as string | null,
    tourTitle: booking.tour?.title ?? "",
    startDate: booking.startDate.toISOString(),
    seats: booking.totalSeats,
    amount: booking.totalPrice,
    currency: booking.currency as SupportedCurrency,
    paymentStatus: booking.paymentsPaymentStatus ?? "pending",
    bookingStatus: booking.status as BookingStatus,
    assignedGuideName: booking.assignedGuide?.name ?? "",
    createdAt: booking.createdAt.toISOString(),
  }));

  const user = session.user as {
    id: string;
    name?: string | null;
    email?: string | null;
  };

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">
            Bookings
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Review, filter, and manage bookings across all tours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <BookingsListClient
            locale={locale}
            tenantDefaultCurrency={tenant.defaultCurrency as SupportedCurrency}
            bookings={rows}
            currentUserName={user.name ?? ""}
          />
        </div>
      </header>
    </main>
  );
}


