import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {locales, type AppLocale} from "@/lib/i18n";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Staff member - Tripsaas",
};

type StaffDetailPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function StaffDetailPage(props: StaffDetailPageProps) {
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

  const staff = await prisma.user.findFirst({
    where: {
      id,
      tenantId: tenantContext.id,
    },
  });

  if (!staff) {
    notFound();
  }

  const bookings = await prisma.booking.findMany({
    where: {
      tenantId: tenantContext.id,
      assignedGuideId: staff.id,
    },
    orderBy: {
      startDate: "desc",
    },
    take: 20,
  });

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">
            {staff.name ?? staff.email}
          </h1>
          <p className="mt-1 text-xs text-neutral-400">{staff.email}</p>
        </div>
        <span className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] text-neutral-100">
          {staff.role}
        </span>
      </header>

      <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        <div className="space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-[11px] font-semibold text-neutral-300">Assigned tours</p>
          <div className="space-y-2 text-[11px] text-neutral-200">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 p-3"
              >
                <div className="flex flex-col">
                  <span className="text-[12px] text-neutral-50">{booking.bookingNumber}</span>
                  <span className="text-[11px] text-neutral-400">
                    {booking.startDate.toISOString()}
                  </span>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-[11px] text-neutral-500">
                No tours currently assigned to this staff member.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 text-[11px] text-neutral-200">
          <p className="text-[11px] font-semibold text-neutral-300">Actions</p>
          <p className="text-[11px] text-neutral-400">
            Wire these controls to API routes to change roles, deactivate staff, and view
            detailed activity logs.
          </p>
        </div>
      </section>
    </main>
  );
}
