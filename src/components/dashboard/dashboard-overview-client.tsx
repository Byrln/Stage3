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

  // Generate mock sparkline data based on existing trends or random variance for visual effect
  // In a real app, this would come from specific API endpoints for each KPI
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
        <BookingsTrendChart data={overview.trends} />
        
        <RevenueByDestinationChart 
          data={overview.destinationRevenue}
          currency={tenantCurrency}
          locale={locale}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-backwards">
        <RecentBookingsTable data={overview.recentBookings} />

        <Card className="col-span-3 shadow-sm transition-shadow hover:shadow-md border-border-subtle bg-bg-surface">
          <CardHeader>
            <CardTitle>{tDashboard("tables.upcomingToursTitle")}</CardTitle>
            <CardDescription>
              {tDashboard("tables.upcomingToursSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview.upcomingTours.length === 0 && (
                <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                  {tDashboard("tables.upcomingToursEmpty")}
                </div>
              )}
              {overview.upcomingTours.map((tour) => {
                const capacity = tour.capacity || 1;
                const occupancy = Math.min(
                  100,
                  Math.round((tour.bookedSeats / capacity) * 100)
                );

                return (
                  <div key={tour.id} className="flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-elevated/30 p-3 transition-colors hover:bg-bg-elevated/50">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {tour.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tour.startDate).toLocaleDateString(locale)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs font-medium">
                        {tour.bookedSeats}/{capacity}
                      </div>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
