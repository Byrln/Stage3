import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireRole} from "@/lib/auth/session";
import {prisma} from "@/lib/prisma";
import {getPlanConfig} from "@/lib/plans";
import {locales, type AppLocale} from "@/lib/i18n";
import type {Plan} from "@prisma/client";
import {SuperadminDashboardClient} from "@/components/dashboard/superadmin/superadmin-dashboard-client";

export const metadata: Metadata = {
  title: "SuperAdmin - Tripsaas",
};

type SuperadminPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SuperadminPage(props: SuperadminPageProps) {
  const {params} = props;
  const {locale} = await params;

  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  const session = await requireRole(["SUPERADMIN"]);
  const user = session.user as any;

  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          tours: true,
          bookings: true,
          users: true,
        },
      },
    },
  });

  const bookingsByTenant = await prisma.booking.groupBy({
    by: ["tenantId"],
    _count: {
      _all: true,
    },
    _sum: {
      totalPrice: true,
    },
    _max: {
      createdAt: true,
    },
  });

  const bookingsIndex = new Map<
    string,
    {
      count: number;
      revenue: number;
      lastBookingAt: Date | null;
    }
  >();

  bookingsByTenant.forEach((row: any) => {
    const revenue = row._sum.totalPrice ?? 0;
    const lastBookingAt = row._max.createdAt ?? null;

    bookingsIndex.set(row.tenantId, {
      count: row._count._all,
      revenue,
      lastBookingAt,
    });
  });

  let totalTenantsActive = 0;
  let totalTenantsTrial = 0;
  let totalTenantsChurned = 0;
  let totalBookings = 0;
  let totalGrossRevenue = 0;
  let mrr = 0;

  const now = new Date();
  const oneYearAgo = new Date(now.getTime());
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const tenantGrowthBuckets = new Map<string, number>();

  function getMonthKey(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, "0")}`;
  }

  tenants.forEach((tenant) => {
    const stats = bookingsIndex.get(tenant.id);
    const revenue = stats?.revenue ?? 0;
    const config = getPlanConfig(tenant.plan);

    totalBookings += stats?.count ?? 0;
    totalGrossRevenue += revenue;

    if (!tenant.isActive) {
      totalTenantsChurned += 1;
    } else if (tenant.plan === "FREE") {
      totalTenantsTrial += 1;
    } else {
      totalTenantsActive += 1;
      mrr += config.price;
    }

    const createdAt = tenant.createdAt;
    if (createdAt >= oneYearAgo) {
      const key = getMonthKey(createdAt);
      const existing = tenantGrowthBuckets.get(key) ?? 0;
      tenantGrowthBuckets.set(key, existing + 1);
    }
  });

  const platformCommissionRate = 0.05;
  const platformRevenue = totalGrossRevenue * platformCommissionRate;

  const growthSeries = Array.from(tenantGrowthBuckets.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, count]) => ({
      month,
      count,
    }));

  const planDistributionMap = new Map<Plan, number>();
  tenants.forEach((tenant) => {
    const current = planDistributionMap.get(tenant.plan) ?? 0;
    planDistributionMap.set(tenant.plan, current + 1);
  });

  const planDistribution = Array.from(planDistributionMap.entries()).map(
    ([plan, count]) => ({
      plan,
      count,
      price: getPlanConfig(plan).price,
    }),
  );

  const topTenantsByRevenue = tenants
    .map((tenant) => {
      const stats = bookingsIndex.get(tenant.id);
      const revenue = stats?.revenue ?? 0;
      return {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const tenantRows = tenants.map((tenant) => {
    const stats = bookingsIndex.get(tenant.id);
    const revenue = stats?.revenue ?? 0;
    const lastActiveAt = stats?.lastBookingAt ?? tenant.updatedAt;
    const config = getPlanConfig(tenant.plan);

    let status: "ACTIVE" | "TRIAL" | "CHURNED" = "ACTIVE";

    if (!tenant.isActive) {
      status = "CHURNED";
    } else if (tenant.plan === "FREE") {
      status = "TRIAL";
    }

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan,
      planPrice: config.price,
      createdAt: tenant.createdAt.toISOString(),
      bookingsCount: stats?.count ?? 0,
      revenue,
      lastActiveAt: lastActiveAt.toISOString(),
      status,
      toursCount: tenant._count.tours,
      staffCount: tenant._count.users,
      storageLimit: config.limits.storage,
    };
  });

  const data = {
    currentUserName: user.name as string | undefined,
    kpis: {
      totalTenants: tenants.length,
      tenantsActive: totalTenantsActive,
      tenantsTrial: totalTenantsTrial,
      tenantsChurned: totalTenantsChurned,
      mrr,
      totalBookings,
      platformRevenue,
    },
    tenants: tenantRows,
    analytics: {
      growthSeries,
      planDistribution,
      topTenantsByRevenue,
    },
  };

  return <SuperadminDashboardClient locale={locale} data={data} />;
}

