import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {DashboardCalendarClient} from "@/components/dashboard/dashboard-calendar-client";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {getDashboardOverviewData} from "@/lib/dashboard/overview";
import {locales, type AppLocale} from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Calendar - Tripsaas",
};

type CalendarPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CalendarPage(props: CalendarPageProps) {
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

  const events = overview.upcomingTours.map((tour) => ({
    id: tour.id,
    title: tour.title,
    startDate: tour.startDate,
    endDate: tour.endDate,
    bookedSeats: tour.bookedSeats,
    capacity: tour.capacity,
  }));

  return <DashboardCalendarClient events={events} locale={locale} />;
}

