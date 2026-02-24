"use client";

import {useState} from "react";
import {Mail, Phone, Globe2} from "lucide-react";
import {formatCurrency, type SupportedCurrency} from "@/lib/currency";

type CustomerBookingRow = {
  id: string;
  bookingNumber: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  currency: SupportedCurrency;
};

type CustomerDetail = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string | null;
  passportNumber: string;
  passportExpiry: string | null;
  preferredLanguage: string;
  preferredCurrency: SupportedCurrency;
  totalBookings: number;
  totalSpent: number;
  tags: string[];
  notes: string;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  bookings: CustomerBookingRow[];
};

type CustomerDetailClientProps = {
  locale: string;
  tenantDefaultCurrency: SupportedCurrency;
  customer: CustomerDetail;
};

type CustomerTab = "overview" | "bookings" | "documents" | "notes" | "activity";

export function CustomerDetailClient(props: CustomerDetailClientProps) {
  const {locale, customer} = props;
  const [activeTab, setActiveTab] = useState<CustomerTab>("overview");

  const avgBookingValue =
    customer.totalBookings === 0
      ? 0
      : Math.round((customer.totalSpent / customer.totalBookings) * 100) / 100;

  const favoriteDestination = customer.bookings.length > 0 ? "TBD" : "N/A";

  return (
    <div className="space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-50">
            {customer.fullName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() || "CU"}
          </div>
          <div>
            <h1 className="font-heading text-lg tracking-tight text-neutral-50">
              {customer.fullName}
            </h1>
            <p className="mt-1 text-[11px] text-neutral-400">
              {customer.email} · {customer.phone || "No phone on file"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-100 hover:bg-neutral-900"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Send email</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-100 hover:bg-neutral-900"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Copy phone</span>
          </button>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-neutral-800 pb-2 text-[11px]">
        {[
          ["overview", "Overview"],
          ["bookings", "Bookings"],
          ["documents", "Documents"],
          ["notes", "Notes"],
          ["activity", "Activity"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id as CustomerTab)}
            className={`rounded-full px-3 py-1 ${
              activeTab === id
                ? "bg-neutral-100 text-neutral-900"
                : "bg-neutral-900 text-neutral-300"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && (
        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] text-neutral-500">Total bookings</p>
              <p className="mt-1 text-sm font-semibold text-neutral-50">
                {customer.totalBookings.toString()}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] text-neutral-500">Total spent</p>
              <p className="mt-1 text-sm font-semibold text-neutral-50">
                {formatCurrency(customer.totalSpent, customer.preferredCurrency, locale)}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] text-neutral-500">Avg booking value</p>
              <p className="mt-1 text-sm font-semibold text-neutral-50">
                {formatCurrency(avgBookingValue, customer.preferredCurrency, locale)}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] text-neutral-500">Favorite destination</p>
              <p className="mt-1 text-sm font-semibold text-neutral-50">
                {favoriteDestination}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Upcoming bookings
              </p>
              <p className="text-[11px] text-neutral-400">
                Wire this section to upcoming bookings for this customer.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Preferences
              </p>
              <div className="space-y-1 text-[11px] text-neutral-300">
                <p>
                  Preferred language:{" "}
                  <span className="text-neutral-50">
                    {customer.preferredLanguage || "Not set"}
                  </span>
                </p>
                <p>
                  Preferred currency:{" "}
                  <span className="text-neutral-50">{customer.preferredCurrency}</span>
                </p>
                <p>
                  Marketing consent:{" "}
                  <span className="text-neutral-50">
                    {customer.marketingConsent ? "Opted in" : "Not opted in"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "bookings" && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-neutral-50">Bookings</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-800">
            <table className="min-w-full divide-y divide-neutral-800 text-xs">
              <thead className="bg-neutral-950/80">
                <tr className="text-[11px] text-neutral-400">
                  <th className="px-3 py-2 text-left font-medium">#</th>
                  <th className="px-3 py-2 text-left font-medium">Start date</th>
                  <th className="px-3 py-2 text-left font-medium">End date</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-950/60">
                {customer.bookings.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center text-[11px] text-neutral-500"
                    >
                      No bookings recorded for this customer.
                    </td>
                  </tr>
                )}
                {customer.bookings.map((booking) => (
                  <tr key={booking.id} className="text-[11px] text-neutral-200">
                    <td className="px-3 py-2">{booking.bookingNumber}</td>
                    <td className="px-3 py-2">
                      {new Date(booking.startDate).toLocaleDateString(locale)}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(booking.endDate).toLocaleDateString(locale)}
                    </td>
                    <td className="px-3 py-2">{booking.status}</td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(booking.totalPrice, booking.currency, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "documents" && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-50">Documents</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] text-neutral-500">Passport</p>
              <p className="text-[11px] text-neutral-300">
                Number: <span className="font-mono">••••••••</span>
              </p>
              <p className="text-[11px] text-neutral-300">
                Expiry:{" "}
                <span className="font-mono">
                  {customer.passportExpiry
                    ? new Date(customer.passportExpiry).toLocaleDateString(locale)
                    : "N/A"}
                </span>
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-100 hover:bg-neutral-900"
              >
                Copy number
              </button>
            </div>
            <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] text-neutral-500">Uploaded documents</p>
              <p className="text-[11px] text-neutral-400">
                Wire this section to your storage (Uploadthing, S3, etc.).
              </p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "notes" && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-50">Notes</h2>
          <p className="text-[11px] text-neutral-400">
            Integrate a rich text editor here for internal notes.
          </p>
        </section>
      )}

      {activeTab === "activity" && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-neutral-50">Activity</h2>
          </div>
          <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-300">
            <p>Wire this timeline to bookings, payments, emails, and notes events.</p>
          </div>
        </section>
      )}
    </div>
  );
}

