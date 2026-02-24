"use client";

import type {BookingStatus} from "@prisma/client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Mail, Printer, ArrowLeft} from "lucide-react";
import {sileo} from "sileo";
import {formatCurrency, type SupportedCurrency} from "@/lib/currency";

type BookingDetailCustomer = {
  name: string;
  email: string;
  phone: string;
};

type BookingDetailTour = {
  id: string;
  title: string;
  duration: number;
  destinations: string[];
  meetingPoint: string;
  endPoint: string;
};

type BookingDetail = {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  seats: number;
  amount: number;
  currency: SupportedCurrency;
  customer: BookingDetailCustomer;
  tour: BookingDetailTour | null;
  assignedGuideName: string;
  createdAt: string;
  internalNotes: string;
};

type BookingDetailClientProps = {
  locale: string;
  tenantDefaultCurrency: SupportedCurrency;
  booking: BookingDetail;
  currentUserName: string;
};

export function BookingDetailClient(props: BookingDetailClientProps) {
  const {locale, tenantDefaultCurrency, booking, currentUserName} = props;
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus>(booking.status);

  function handleStatusChange(next: BookingStatus) {
    if (next === status) {
      return;
    }

    setStatus(next);

    sileo.info({
      title: "Status change queued",
      description:
        "Wire this control to a mutation that updates the booking status and audit log.",
    });
  }

  function handleSendEmail() {
    sileo.info({
      title: "Email composer",
      description: "Open a modal to select a template, preview, and send email.",
    });
  }

  function handleIssueRefund() {
    sileo.error({
      title: "Refund flow",
      description: "Connect this action to your payments provider with confirmation.",
    });
  }

  function handleDownloadVoucher() {
    const url = `/api/bookings/${booking.id}/voucher`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 text-neutral-200 hover:bg-neutral-900"
            onClick={() => router.push(`/${locale}/dashboard/bookings`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-heading text-xl tracking-tight text-neutral-50">
              Booking {booking.bookingNumber}
            </h1>
            <p className="mt-1 text-xs text-neutral-400">
              Updated by {currentUserName || "operator"} ·{" "}
              {new Date(booking.createdAt).toLocaleString(locale)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(event) => handleStatusChange(event.target.value as BookingStatus)}
            className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-xs text-neutral-100 outline-none"
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 hover:bg-neutral-900"
            onClick={handleSendEmail}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Send email</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200 hover:bg-amber-500/20"
            onClick={handleIssueRefund}
          >
            <span>Issue refund</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 hover:bg-neutral-900"
            onClick={handleDownloadVoucher}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Voucher PDF</span>
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Customer
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-100">
                  {booking.customer.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase() || "GU"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-50">{booking.customer.name}</span>
                  <span className="text-[11px] text-neutral-400">{booking.customer.email}</span>
                  <span className="text-[11px] text-neutral-400">{booking.customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Tour
              </p>
              {booking.tour ? (
                <div className="space-y-1">
                  <p className="text-sm text-neutral-50">{booking.tour.title}</p>
                  <p className="text-[11px] text-neutral-400">
                    {booking.tour.duration} days ·{" "}
                    {booking.tour.destinations.slice(0, 3).join(" · ")}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Meeting: {booking.tour.meetingPoint || "TBA"}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    End: {booking.tour.endPoint || "TBA"}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-neutral-500">Tour record is no longer available.</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] text-neutral-500">Travel dates</p>
              <p className="text-xs text-neutral-50">
                {new Date(booking.startDate).toLocaleDateString(locale)}–{" "}
                {new Date(booking.endDate).toLocaleDateString(locale)}
              </p>
              <p className="text-[11px] text-neutral-400">{booking.seats} seats</p>
            </div>
            <div className="space-y-1 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] text-neutral-500">Payment</p>
              <p className="text-xs text-neutral-50">
                {formatCurrency(booking.amount, tenantDefaultCurrency, locale)}
              </p>
              <p className="text-[11px] text-neutral-400">Status: {booking.paymentStatus}</p>
            </div>
            <div className="space-y-1 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] text-neutral-500">Guide</p>
              <p className="text-xs text-neutral-50">
                {booking.assignedGuideName || "Not assigned"}
              </p>
              <p className="text-[11px] text-neutral-400">
                Booking status: {status.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Timeline
            </p>
            <ol className="space-y-2 text-[11px] text-neutral-300">
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-neutral-50">Pending</p>
                  <p className="text-neutral-400">Booking created</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-neutral-50">Confirmed</p>
                  <p className="text-neutral-400">
                    Wire this step to booking.confirmedAt and actor metadata.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-neutral-50">Completed</p>
                  <p className="text-neutral-400">
                    When booking is marked completed, reflect that here with timestamp.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="space-y-2 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Internal notes
            </p>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              defaultValue={booking.internalNotes}
              placeholder="Use this area for internal notes and context between staff."
            />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-50 hover:bg-neutral-700"
              onClick={() =>
                sileo.success({
                  title: "Notes draft saved",
                  description: "Wire this action to a mutation to persist internal notes.",
                })
              }
            >
              Save notes
            </button>
          </section>

          <section className="space-y-2 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Actions
            </p>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 hover:bg-neutral-900"
              onClick={handleDownloadVoucher}
            >
              Download voucher PDF
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-100 hover:bg-neutral-900"
              onClick={() =>
                sileo.info({
                  title: "Print view",
                  description: "Add a dedicated printer-friendly route or CSS print styles.",
                })
              }
            >
              Print
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
