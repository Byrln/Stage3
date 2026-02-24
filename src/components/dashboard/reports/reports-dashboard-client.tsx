"use client";

import {useMemo, useRef, useState} from "react";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {sileo} from "sileo";
import type {DashboardOverviewData} from "@/lib/dashboard/overview";
import {formatCurrency, type SupportedCurrency} from "@/lib/currency";
import {exportToCSV, exportToExcel, exportToPDF} from "@/lib/export";

type ReportsDashboardClientProps = {
  locale: string;
  tenantCurrency: SupportedCurrency;
  overview: DashboardOverviewData;
};

type ReportTemplateId =
  | "monthlyRevenue"
  | "bookingSummary"
  | "customerAcquisition"
  | "tourPerformance"
  | "cancellation"
  | "vendorPayment";

type PeriodPreset = "30d" | "90d" | "thisYear" | "lastYear";

export function ReportsDashboardClient(props: ReportsDashboardClientProps) {
  const {locale, tenantCurrency, overview} = props;
  const [activeTemplate, setActiveTemplate] = useState<ReportTemplateId>("monthlyRevenue");
  const [period, setPeriod] = useState<PeriodPreset>("30d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [scheduleFrequency, setScheduleFrequency] = useState<"none" | "weekly" | "monthly">(
    "none",
  );
  const previewRef = useRef<HTMLDivElement | null>(null);

  const trends = useMemo(() => {
    if (period === "30d") {
      return overview.trends.slice(-30);
    }
    if (period === "90d") {
      return overview.trends.slice(-90);
    }
    return overview.trends;
  }, [overview.trends, period]);

  const monthlyRevenueRows = trends.map((point) => ({
    date: point.date,
    revenue: point.revenue,
  }));

  const bookingSummaryRows = overview.recentBookings.map((booking) => ({
    bookingNumber: booking.bookingNumber,
    customerName: booking.customerName,
    tourTitle: booking.tourTitle,
    startDate: booking.startDate,
    seats: booking.seats,
    amount: booking.amount,
    status: booking.status,
  }));

  const activeData =
    activeTemplate === "monthlyRevenue" ? monthlyRevenueRows : bookingSummaryRows;

  function handleExportCsv() {
    if (activeTemplate === "monthlyRevenue") {
      exportToCSV(
        monthlyRevenueRows,
        "monthly-revenue-report",
        [
          {key: "date", label: "Date"},
          {key: "revenue", label: "Revenue"},
        ],
      );
      return;
    }

    exportToCSV(
      bookingSummaryRows,
      "booking-summary-report",
      [
        {key: "bookingNumber", label: "Booking #"},
        {key: "customerName", label: "Customer"},
        {key: "tourTitle", label: "Tour"},
        {key: "startDate", label: "Start date"},
        {key: "seats", label: "Seats"},
        {key: "amount", label: "Amount"},
        {key: "status", label: "Status"},
      ],
    );
  }

  function handleExportExcel() {
    if (activeTemplate === "monthlyRevenue") {
      exportToExcel(
        monthlyRevenueRows,
        "monthly-revenue-report",
        [
          {key: "date", label: "Date"},
          {key: "revenue", label: "Revenue"},
        ],
      );
      return;
    }

    exportToExcel(
      bookingSummaryRows,
      "booking-summary-report",
      [
        {key: "bookingNumber", label: "Booking #"},
        {key: "customerName", label: "Customer"},
        {key: "tourTitle", label: "Tour"},
        {key: "startDate", label: "Start date"},
        {key: "seats", label: "Seats"},
        {key: "amount", label: "Amount"},
        {key: "status", label: "Status"},
      ],
    );
  }

  async function handleExportPdf() {
    if (!previewRef.current) {
      return;
    }
    const filename =
      activeTemplate === "monthlyRevenue"
        ? "monthly-revenue-report"
        : "booking-summary-report";
    await exportToPDF(previewRef.current, filename);
  }

  function handleSchedule() {
    if (scheduleFrequency === "none") {
      sileo.info({
        title: "Schedule report",
        description: "Choose weekly or monthly to schedule this report.",
      });
      return;
    }

    sileo.success({
      title: "Report schedule saved",
      description:
        "Wire this control to an API that persists schedules and triggers emails.",
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
      <aside className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
        <h2 className="text-sm font-semibold text-neutral-50">Report templates</h2>
        <p className="text-[11px] text-neutral-400">
          Select a template, adjust the date range, then preview and export.
        </p>

        <div className="mt-2 space-y-1 text-[11px]">
          {[
            ["monthlyRevenue", "Monthly Revenue Report"],
            ["bookingSummary", "Booking Summary Report"],
            ["customerAcquisition", "Customer Acquisition Report"],
            ["tourPerformance", "Tour Performance Report"],
            ["cancellation", "Cancellation Report"],
            ["vendorPayment", "Vendor Payment Report"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTemplate(id as ReportTemplateId)}
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left ${
                activeTemplate === id
                  ? "bg-neutral-100 text-neutral-900"
                  : "bg-neutral-900 text-neutral-300"
              }`}
            >
              <span className="text-[11px]">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-2 border-t border-neutral-800 pt-3 text-[11px]">
          <p className="font-semibold text-neutral-200">Date range</p>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as PeriodPreset)}
              className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
            >
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="thisYear">This year</option>
              <option value="lastYear">Last year</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
            />
            <span className="text-neutral-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
            />
          </div>
        </div>

        <div className="mt-3 space-y-2 border-t border-neutral-800 pt-3 text-[11px]">
          <p className="font-semibold text-neutral-200">Schedule report</p>
          <select
            value={scheduleFrequency}
            onChange={(event) =>
              setScheduleFrequency(event.target.value as "none" | "weekly" | "monthly")
            }
            className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
          >
            <option value="none">No schedule</option>
            <option value="weekly">Weekly email</option>
            <option value="monthly">Monthly email</option>
          </select>
          <button
            type="button"
            onClick={handleSchedule}
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-neutral-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
          >
            Save schedule
          </button>
        </div>
      </aside>

      <section className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-neutral-50">Preview</h2>
            <p className="text-[11px] text-neutral-400">
              Preview the selected report before exporting or scheduling.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-neutral-100 hover:bg-neutral-900"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-neutral-100 hover:bg-neutral-900"
            >
              Export Excel
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-neutral-100 hover:bg-neutral-900"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div ref={previewRef} className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
          {activeTemplate === "monthlyRevenue" && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-neutral-200">
                Monthly Revenue Report
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenueRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} />
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
              <table className="mt-3 min-w-full divide-y divide-neutral-800 text-[11px]">
                <thead className="bg-neutral-950/80 text-neutral-400">
                  <tr>
                    <th className="px-2 py-1 text-left font-medium">Date</th>
                    <th className="px-2 py-1 text-right font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-200">
                  {monthlyRevenueRows.map((row) => (
                    <tr key={row.date}>
                      <td className="px-2 py-1">
                        {new Date(row.date).toLocaleDateString(locale)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {formatCurrency(row.revenue, tenantCurrency, locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTemplate === "bookingSummary" && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-neutral-200">
                Booking Summary Report
              </p>
              <table className="min-w-full divide-y divide-neutral-800 text-[11px]">
                <thead className="bg-neutral-950/80 text-neutral-400">
                  <tr>
                    <th className="px-2 py-1 text-left font-medium">Booking #</th>
                    <th className="px-2 py-1 text-left font-medium">Customer</th>
                    <th className="px-2 py-1 text-left font-medium">Tour</th>
                    <th className="px-2 py-1 text-left font-medium">Start date</th>
                    <th className="px-2 py-1 text-right font-medium">Seats</th>
                    <th className="px-2 py-1 text-right font-medium">Amount</th>
                    <th className="px-2 py-1 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-200">
                  {bookingSummaryRows.map((row) => (
                    <tr key={row.bookingNumber}>
                      <td className="px-2 py-1">{row.bookingNumber}</td>
                      <td className="px-2 py-1">{row.customerName}</td>
                      <td className="px-2 py-1">{row.tourTitle}</td>
                      <td className="px-2 py-1">
                        {new Date(row.startDate).toLocaleDateString(locale)}
                      </td>
                      <td className="px-2 py-1 text-right">{row.seats}</td>
                      <td className="px-2 py-1 text-right">
                        {formatCurrency(row.amount, tenantCurrency, locale)}
                      </td>
                      <td className="px-2 py-1 text-right">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTemplate !== "monthlyRevenue" && activeTemplate !== "bookingSummary" && (
            <div className="space-y-2 text-[11px] text-neutral-300">
              <p className="font-semibold text-neutral-200">
                This template is scaffolded.
              </p>
              <p>
                Wire this section to dedicated queries and data structures for the "
                {activeTemplate}" report.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

