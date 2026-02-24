import type {Metadata} from "next";
import {notFound} from "next/navigation";
import type {BookingStatus} from "@prisma/client";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {locales, type AppLocale} from "@/lib/i18n";
import type {SupportedCurrency} from "@/lib/currency";
import {BookingDetailClient} from "@/components/dashboard/bookings/booking-detail-client";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Booking detail - Tripsaas",
};

type BookingDetailPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function BookingDetailPage(props: BookingDetailPageProps) {
  const {params} = props;
  const {locale, id} = await params;

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

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      tenantId: tenant.id,
    },
    include: {
      customer: true,
      tour: true,
      assignedGuide: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const user = session.user as {
    id: string;
    name?: string | null;
    email?: string | null;
  };

  return (
    <main className="space-y-4">
      <BookingDetailClient
        locale={locale}
        tenantDefaultCurrency={tenant.defaultCurrency as SupportedCurrency}
        booking={{
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          status: booking.status as BookingStatus,
          paymentStatus: booking.paymentsPaymentStatus ?? "pending",
          startDate: booking.startDate.toISOString(),
          endDate: booking.endDate.toISOString(),
          seats: booking.totalSeats,
          amount: booking.totalPrice,
          currency: booking.currency as SupportedCurrency,
          customer: {
            name: `${booking.customer.firstName} ${booking.customer.lastName}`.trim(),
            email: booking.customer.email,
            phone: booking.customer.phone ?? "",
          },
          tour: booking.tour
            ? {
                id: booking.tour.id,
                title: booking.tour.title,
                duration: booking.tour.duration,
                destinations: booking.tour.destinations,
                meetingPoint: booking.tour.meetingPoint ?? "",
                endPoint: booking.tour.endPoint ?? "",
              }
            : null,
          assignedGuideName: booking.assignedGuide?.name ?? "",
          createdAt: booking.createdAt.toISOString(),
          internalNotes: booking.internalNotes ?? "",
        }}
        currentUserName={user.name ?? ""}
      />
    </main>
  );
}

