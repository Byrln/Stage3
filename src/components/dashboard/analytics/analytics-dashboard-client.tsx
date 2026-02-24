"use client";

import type {DashboardOverviewData} from "@/lib/dashboard/overview";
import {useMemo, useState} from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {formatCurrency, type SupportedCurrency} from "@/lib/currency";

type AnalyticsDashboardClientProps = {
  locale: string;
  tenantCurrency: SupportedCurrency;
  overview: DashboardOverviewData;
};

type PeriodPreset = "7d" | "30d" | "90d" | "year";

export function AnalyticsDashboardClient(props: AnalyticsDashboardClientProps) {
  const {overview, tenantCurrency, locale} = props;
  const [period, setPeriod] = useState<PeriodPreset>("30d");

  const trendData = useMemo(() => {
    if (period === "7d") {
      return overview.trends.slice(-7);
    }
    if (period === "30d") {
      return overview.trends.slice(-30);
    }
    return overview.trends;
  }, [overview.trends, period]);

  const revenueSeries = trendData.map((point) => ({
    date: point.date,
    confirmed: point.revenue,
    refunded: 0,
  }));

  const bookingsSeries = trendData.map((point) => ({
    date: point.date,
    bookings: point.bookings,
    cancellations: 0,
  }));

  const cancellationRateData = [
    {
      name: "Cancellation rate",
      value: 10,
    },
  ];

  const nationalityData = [
    {name: "US", value: 45},
    {name: "UK", value: 20},
    {name: "DE", value: 15},
    {name: "FR", value: 10},
    {name: "Other", value: 10},
  ];

  const clvData = [
    {bucket: "< 500", value: 30},
    {bucket: "500-1000", value: 20},
    {bucket: "1000-2500", value: 15},
    {bucket: "> 2500", value: 5},
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {[
            ["7d", "Last 7 days"],
            ["30d", "Last 30 days"],
            ["90d", "Last 90 days"],
            ["year", "This year"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value as PeriodPreset)}
              className={`rounded-full px-3 py-1 ${
                period === value
                  ? "bg-neutral-100 text-neutral-900"
                  : "bg-neutral-900 text-neutral-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">Revenue over time</h2>
          <p className="text-[11px] text-neutral-400">
            Confirmed vs refunded revenue for the selected period.
          </p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="date" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip
                  formatter={(value: number) =>
                    formatCurrency(value, tenantCurrency, locale)
                  }
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="confirmed"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e33"
                />
                <Area
                  type="monotone"
                  dataKey="refunded"
                  stackId="1"
                  stroke="#f97316"
                  fill="#f9731633"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">Revenue by tour</h2>
          <p className="text-[11px] text-neutral-400">
            Top-performing tours for the current period.
          </p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.destinationRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="label" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip
                  formatter={(value: number) =>
                    formatCurrency(value, tenantCurrency, locale)
                  }
                />
                <Bar dataKey="revenue" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">Revenue by destination</h2>
          <p className="text-[11px] text-neutral-400">
            Breakdown by country or region based on tour destinations.
          </p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.destinationRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="label" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip
                  formatter={(value: number) =>
                    formatCurrency(value, tenantCurrency, locale)
                  }
                />
                <Bar dataKey="bookings" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">Bookings trend</h2>
          <p className="text-[11px] text-neutral-400">
            Confirmed bookings vs cancellations over time.
          </p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="date" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cancellations"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">Booking funnel</h2>
          <p className="text-[11px] text-neutral-400">
            Placeholder funnel; wire to marketing and session analytics.
          </p>
          <div className="mt-3 flex h-44 items-center justify-center text-[11px] text-neutral-400">
            No funnel data yet.
          </div>
        </div>

        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">Cancellation rate</h2>
          <p className="text-[11px] text-neutral-400">
            Percentage of bookings that were cancelled in this period.
          </p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="60%"
                outerRadius="90%"
                data={cancellationRateData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <PolarRadiusAxis tick={false} />
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#f97316"
                  background={{fill: "#020617"}}
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">New vs returning</h2>
          <p className="text-[11px] text-neutral-400">
            Placeholder chart; wire to customer cohorts.
          </p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  {date: "Week 1", newCustomers: 10, returningCustomers: 5},
                  {date: "Week 2", newCustomers: 12, returningCustomers: 7},
                  {date: "Week 3", newCustomers: 9, returningCustomers: 8},
                  {date: "Week 4", newCustomers: 11, returningCustomers: 9},
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="date" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newCustomers"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="returningCustomers"
                  stroke="#38bdf8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">
            Customer nationality breakdown
          </h2>
          <p className="text-[11px] text-neutral-400">
            Placeholder distribution; wire to customer profiles.
          </p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  data={nationalityData}
                  outerRadius="80%"
                  fill="#22c55e"
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">Customer lifetime value</h2>
          <p className="text-[11px] text-neutral-400">
            Distribution of customers by total spend.
          </p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clvData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="bucket" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">Occupancy heatmap</h2>
          <p className="text-[11px] text-neutral-400">
            Placeholder grid; wire to tour occupancy by month.
          </p>
          <div className="mt-3 grid h-44 grid-cols-6 gap-1 text-[10px] text-neutral-300">
            {Array.from({length: 24}).map((_, index) => {
              const intensity = (index % 6) / 5;
              return (
                <div
                  key={index}
                  className="flex items-center justify-center rounded bg-emerald-500/20"
                  style={{opacity: 0.3 + intensity * 0.7}}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-64 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <h2 className="text-sm font-semibold text-neutral-50">Peak season analysis</h2>
          <p className="text-[11px] text-neutral-400">
            Placeholder seasonal pattern; wire to occupancy per month.
          </p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {month: "Jan", value: 30},
                  {month: "Feb", value: 35},
                  {month: "Mar", value: 40},
                  {month: "Apr", value: 50},
                  {month: "May", value: 70},
                  {month: "Jun", value: 80},
                  {month: "Jul", value: 90},
                  {month: "Aug", value: 95},
                  {month: "Sep", value: 70},
                  {month: "Oct", value: 60},
                  {month: "Nov", value: 40},
                  {month: "Dec", value: 35},
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="month" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

