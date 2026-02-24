import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {locales, type AppLocale} from "@/lib/i18n";
import {StaffListClient} from "@/components/dashboard/staff/staff-list-client";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Staff - Tripsaas",
};

type StaffPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function StaffPage(props: StaffPageProps) {
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

  const users = await prisma.user.findMany({
    where: {
      tenantId: tenant.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const bookingsByGuide = (await prisma.booking.groupBy({
    by: ["assignedGuideId"],
    where: {
      tenantId: tenant.id,
      assignedGuideId: {
        not: null,
      },
    },
    _count: {
      _all: true,
    },
  })) as {
    assignedGuideId: string | null;
    _count: {
      _all: number;
    };
  }[];

  const bookingsCountByGuide = new Map<string, number>();
  bookingsByGuide.forEach((group) => {
    if (group.assignedGuideId) {
      bookingsCountByGuide.set(group.assignedGuideId, group._count._all);
    }
  });

  const currentUserId = (session.user as any)?.id as string | undefined;

  const rows = users.map((user) => ({
    id: user.id,
    name: user.name ?? user.email,
    email: user.email,
    role: user.role,
    lastActiveAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    assignedToursCount: bookingsCountByGuide.get(user.id) ?? 0,
    isCurrentUser: currentUserId === user.id,
  }));

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">Staff</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Manage team members, roles, and tour assignments.
          </p>
        </div>
      </header>

      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
        <StaffListClient locale={locale} staff={rows} />
      </section>
    </main>
  );
}
