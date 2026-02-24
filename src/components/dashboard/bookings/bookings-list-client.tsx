"use client";

import type {BookingStatus} from "@prisma/client";
import {useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Filter, Search} from "lucide-react";
import {sileo} from "sileo";
import {formatCurrency, type SupportedCurrency} from "@/lib/currency";
import {BookingCreateModal} from "./booking-create-modal";

type BookingPaymentStatus = "pending" | "paid" | "refunded" | "failed";

type BookingRow = {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerAvatar: string | null;
  tourTitle: string;
  startDate: string;
  seats: number;
  amount: number;
  currency: SupportedCurrency;
  paymentStatus: string;
  bookingStatus: BookingStatus;
  assignedGuideName: string;
  createdAt: string;
};

type BookingsListClientProps = {
  locale: string;
  tenantDefaultCurrency: SupportedCurrency;
  bookings: BookingRow[];
  currentUserName: string;
};

type StatusFilterValue = "all" | BookingStatus;

type PaymentStatusFilterValue = "all" | BookingPaymentStatus;

export function BookingsListClient(props: BookingsListClientProps) {
  const {locale, tenantDefaultCurrency, bookings, currentUserName} = props;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatusFilterValue>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);

  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((booking) => {
        if (booking.bookingNumber.toLowerCase().includes(query)) {
          return true;
        }
        if (booking.customerName.toLowerCase().includes(query)) {
          return true;
        }
        if (booking.tourTitle.toLowerCase().includes(query)) {
          return true;
        }
        return false;
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.bookingStatus === statusFilter);
    }

    if (paymentFilter !== "all") {
      result = result.filter((booking) => {
        const status = booking.paymentStatus ?? "pending";
        return status === paymentFilter;
      });
    }

    return result;
  }, [bookings, searchQuery, statusFilter, paymentFilter]);

  function toggleSelectAll() {
    if (selectedIds.size === filteredBookings.length) {
      setSelectedIds(new Set());
      return;
    }

    const next = new Set<string>();
    filteredBookings.forEach((booking) => next.add(booking.id));
    setSelectedIds(next);
  }

  function toggleSelectRow(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  }

  function handleBulkAction(action: "confirm" | "cancel" | "remind" | "export") {
    if (selectedIds.size === 0) {
      return;
    }

    if (action === "export") {
      sileo.info({
        title: "Export CSV",
        description: "Wire this action to an API route that returns CSV.",
      });
      return;
    }

    if (action === "remind") {
      sileo.info({
        title: "Send reminders",
        description: "Wire this action to your email service via API.",
      });
      return;
    }

    if (action === "confirm") {
      sileo.info({
        title: "Confirm bookings",
        description: "Bulk confirmation can use TanStack Query mutations.",
      });
      return;
    }

    sileo.error({
      title: "Cancel bookings",
      description: "Cancelling bookings should be confirmed and persisted through an API.",
    });
  }

  function navigateToDetail(id: string) {
    router.push(`/${locale}/dashboard/bookings/${id}`);
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                const value = event.target.value;
                setSearchQuery(value);
                const next = new URLSearchParams(searchParams.toString());
                if (value) {
                  next.set("q", value);
                } else {
                  next.delete("q");
                }
                router.replace(`/${locale}/dashboard/bookings?${next.toString()}`);
              }}
              placeholder="Search by booking, customer, or tour"
              className="h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 pl-9 pr-3 text-xs text-neutral-100 outline-none ring-0 placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-300">
              <Filter className="h-3.5 w-3.5 text-neutral-500" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilterValue)}
                className="bg-transparent text-[11px] outline-none"
              >
                <option value="all">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-300">
              <span className="text-neutral-400">Payment</span>
              <select
                value={paymentFilter}
                onChange={(event) =>
                  setPaymentFilter(event.target.value as PaymentStatusFilterValue)
                }
                className="bg-transparent text-[11px] outline-none"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-primary-500"
            onClick={() => setCreateOpen(true)}
          >
            New booking
          </button>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-200">
              <span>{selectedIds.size} selected</span>
              <button
                type="button"
                className="rounded-full px-2 py-0.5 hover:bg-emerald-500/20"
                onClick={() => handleBulkAction("confirm")}
              >
                Confirm
              </button>
              <button
                type="button"
                className="rounded-full px-2 py-0.5 hover:bg-emerald-500/20"
                onClick={() => handleBulkAction("cancel")}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full px-2 py-0.5 hover:bg-emerald-500/20"
                onClick={() => handleBulkAction("remind")}
              >
                Send reminders
              </button>
              <button
                type="button"
                className="rounded-full px-2 py-0.5 hover:bg-emerald-500/20"
                onClick={() => handleBulkAction("export")}
              >
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>

      <BookingCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <div className="overflow-hidden rounded-2xl border border-neutral-800">
        <table className="min-w-full divide-y divide-neutral-800 text-xs">
          <thead className="bg-neutral-950/80 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-neutral-600 text-emerald-500"
                  checked={
                    filteredBookings.length > 0 && selectedIds.size === filteredBookings.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-3 py-2 text-left">Booking</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Tour</th>
              <th className="px-3 py-2 text-left">Start date</th>
              <th className="px-3 py-2 text-right">Seats</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-left">Payment</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Guide</th>
              <th className="px-3 py-2 text-right">Created</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 bg-neutral-950/60">
            {filteredBookings.length === 0 && (
              <tr>
                <td
                  colSpan={12}
                  className="px-3 py-6 text-center text-[11px] text-neutral-500"
                >
                  No bookings match the current filters.
                </td>
              </tr>
            )}

            {filteredBookings.map((booking) => {
              const isSelected = selectedIds.has(booking.id);

              const paymentStatus = (booking.paymentStatus ?? "pending") as BookingPaymentStatus;

              return (
                <tr key={booking.id} className="text-[11px] text-neutral-100 hover:bg-neutral-900/80">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-neutral-600 text-emerald-500"
                      checked={isSelected}
                      onChange={() => toggleSelectRow(booking.id)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-neutral-400">
                    {booking.bookingNumber}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-semibold">
                        {booking.customerName
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase() || "GU"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs">{booking.customerName || "Guest"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className="line-clamp-2 text-[10px] text-neutral-300">
                      {booking.tourTitle}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[10px] text-neutral-300">
                    {new Date(booking.startDate).toLocaleDateString(locale)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right text-[10px] text-neutral-300">
                    {booking.seats}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right text-[10px] text-neutral-100">
                    {formatCurrency(booking.amount, tenantDefaultCurrency, locale)}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        paymentStatus === "paid"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : paymentStatus === "pending"
                          ? "bg-amber-500/15 text-amber-300"
                          : paymentStatus === "refunded"
                          ? "bg-sky-500/15 text-sky-300"
                          : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "COMPLETED"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : booking.bookingStatus === "PENDING"
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {booking.bookingStatus.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[10px] text-neutral-300">
                    {booking.assignedGuideName || "Unassigned"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right text-[10px] text-neutral-400">
                    {new Date(booking.createdAt).toLocaleDateString(locale)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[10px] text-neutral-200 hover:bg-neutral-900"
                      onClick={() => navigateToDetail(booking.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-400">
        <div>
          Showing {filteredBookings.length} bookings
        </div>
        <div className="text-right text-[10px] text-neutral-500">
          Managing as {currentUserName || "operator"}
        </div>
      </div>
    </div>
  );
}
