"use client";

import type { BookingStatus } from "@prisma/client";
import type { DashboardOverviewData } from "@/lib/dashboard/overview";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  CalendarDays,
  LineChart as LineChartIcon,
  Percent,
  Users,
} from "lucide-react";

import { formatCurrency, type SupportedCurrency } from "@/lib/currency";
import { KPIStats } from "@/components/dashboard/kpi-stats";
import { PageHeader } from "@/components/dashboard/page-header";
import { BookingsTrendChart } from "@/components/dashboard/bookings-trend-chart";
import { RevenueByDestinationChart } from "@/components/dashboard/revenue-by-destination-chart";
import { RecentBookingsTable } from "@/components/dashboard/recent-bookings-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardOverviewClientProps = {
  overview: DashboardOverviewData;
  tenantCurrency: SupportedCurrency;
  locale: string;
};

export function DashboardOverviewClient(props: DashboardOverviewClientProps) {
  const { overview, tenantCurrency, locale } = props;
  const router = useRouter();
  const tDashboard = useTranslations("dashboard");

  const bookingsChange =
    overview.kpis.totalBookingsYesterday === 0
      ? overview.kpis.totalBookingsToday > 0
        ? 100
        : 0
      : Math.round(
          ((overview.kpis.totalBookingsToday -
            overview.kpis.totalBookingsYesterday) /
            overview.kpis.totalBookingsYesterday) *
            100
        );

  const revenueChange =
    overview.kpis.revenueLastMonth === 0
      ? overview.kpis.revenueMonthToDate > 0
        ? 100
        : 0
      : Math.round(
          ((overview.kpis.revenueMonthToDate -
            overview.kpis.revenueLastMonth) /
            overview.kpis.revenueLastMonth) *
            100
        );
  const generateSparkline = (baseValue: number, days = 7) => {
    return Array.from({ length: days }).map((_, i) => ({
      value: Math.max(0, baseValue * (0.8 + Math.random() * 0.4)),
    }));
  };

  const bookingSparkline = useMemo(() => generateSparkline(overview.kpis.totalBookingsToday), [overview.kpis.totalBookingsToday]);
  const revenueSparkline = useMemo(() => generateSparkline(overview.kpis.revenueMonthToDate / 30), [overview.kpis.revenueMonthToDate]);
  const activeToursSparkline = useMemo(() => generateSparkline(overview.kpis.activeTours), [overview.kpis.activeTours]);
  const occupancySparkline = useMemo(() => generateSparkline(overview.kpis.occupancyRate), [overview.kpis.occupancyRate]);

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <PageHeader />

      {/* 2. KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPIStats
          index={0}
          title={tDashboard("kpiBookingsToday")}
          value={overview.kpis.totalBookingsToday}
          icon={CalendarDays}
          trend={bookingsChange}
          trendLabel="vs yesterday"
          chartData={bookingSparkline}
          color="blue"
        />
        
        <KPIStats
          index={1}
          title={tDashboard("kpiRevenueMtd")}
          value={overview.kpis.revenueMonthToDate}
          icon={LineChartIcon}
          trend={revenueChange}
          trendLabel="vs last month"
          chartData={revenueSparkline}
          color="green"
          formatter={(val) => formatCurrency(val, tenantCurrency, locale)}
        />
        
        <KPIStats
          index={2}
          title={tDashboard("kpiActiveTours")}
          value={overview.kpis.activeTours}
          icon={Users}
          trend={overview.kpis.upcomingToursNext7Days > 0 ? 12 : -5} // Mock trend for demo
          trendLabel="active now"
          chartData={activeToursSparkline}
          color="amber"
        />
        
        <KPIStats
          index={3}
          title={tDashboard("kpiOccupancy")}
          value={overview.kpis.occupancyRate}
          suffix="%"
          icon={Percent}
          trend={overview.kpis.occupancyRate > 50 ? 8 : -2} // Mock trend for demo
          trendLabel="avg. fill rate"
          chartData={occupancySparkline}
          color="purple"
        />
      </div>

      {/* 3. Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-backwards">
        <RevenueByDestinationChart 
          data={overview.destinationRevenue}
          currency={tenantCurrency}
          locale={locale}
        />
        <BookingsTrendChart data={overview.trends} />
        
       
      </div>

      <div className="col-span-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-backwards">
        <RecentBookingsTable data={overview.recentBookings} />
      </div>
    </div>
  );
}
