"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Search} from "lucide-react";
import {formatCurrency, type SupportedCurrency} from "@/lib/currency";

type CustomerRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  totalBookings: number;
  totalSpent: number;
  preferredCurrency: SupportedCurrency;
  tags: string[];
  lastActivity: string;
};

type CustomersListClientProps = {
  locale: string;
  tenantDefaultCurrency: SupportedCurrency;
  customers: CustomerRow[];
};

function nationalityFlag(input: string): string {
  if (!input) {
    return "";
  }
  const code = input.trim().slice(0, 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) {
    return "";
  }
  const base = 127397;
  return String.fromCodePoint(code.charCodeAt(0) + base, code.charCodeAt(1) + base);
}

export function CustomersListClient(props: CustomersListClientProps) {
  const {locale, customers, tenantDefaultCurrency} = props;
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) {
      return customers;
    }
    const lower = query.toLowerCase();
    return customers.filter((customer) => {
      return (
        customer.fullName.toLowerCase().includes(lower) ||
        customer.email.toLowerCase().includes(lower) ||
        customer.phone.toLowerCase().includes(lower)
      );
    });
  }, [customers, query]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customers…"
            className="h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 pl-8 pr-3 text-xs text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800">
        <table className="min-w-full divide-y divide-neutral-800 text-xs">
          <thead className="bg-neutral-950/80">
            <tr className="text-[11px] text-neutral-400">
              <th className="px-3 py-2 text-left font-medium">Customer</th>
              <th className="px-3 py-2 text-left font-medium">Email</th>
              <th className="px-3 py-2 text-left font-medium">Phone</th>
              <th className="px-3 py-2 text-left font-medium">Nationality</th>
              <th className="px-3 py-2 text-right font-medium">Total bookings</th>
              <th className="px-3 py-2 text-right font-medium">Total spent</th>
              <th className="px-3 py-2 text-left font-medium">Tags</th>
              <th className="px-3 py-2 text-right font-medium">Last activity</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 bg-neutral-950/60">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-6 text-center text-[11px] text-neutral-500"
                >
                  No customers found for this search.
                </td>
              </tr>
            )}

            {filtered.map((customer) => {
              const flag = nationalityFlag(customer.nationality);
              const currency = customer.preferredCurrency || tenantDefaultCurrency;

              return (
                <tr
                  key={customer.id}
                  className="cursor-pointer text-[11px] text-neutral-200 hover:bg-neutral-900/70"
                  onClick={() => router.push(`/${locale}/dashboard/customers/${customer.id}`)}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-semibold text-neutral-100">
                        {customer.fullName
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase() || "CU"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-50">{customer.fullName}</span>
                        {customer.tags.length > 0 && (
                          <span className="text-[10px] text-neutral-400">
                            {customer.tags.slice(0, 3).join(" · ")}
                            {customer.tags.length > 3 ? " +" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <span className="block max-w-[180px] truncate">{customer.email}</span>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <span className="block max-w-[120px] truncate">{customer.phone}</span>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex items-center gap-1">
                      {flag && <span>{flag}</span>}
                      <span className="truncate">{customer.nationality}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right align-top">
                    {customer.totalBookings.toString()}
                  </td>
                  <td className="px-3 py-2 text-right align-top">
                    {formatCurrency(customer.totalSpent, currency, locale)}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right align-top text-neutral-400">
                    {new Date(customer.lastActivity).toLocaleDateString(locale)}
                  </td>
                  <td className="px-3 py-2 text-right align-top">
                    <button
                      type="button"
                      className="rounded-full border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800"
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(`/${locale}/dashboard/customers/${customer.id}`);
                      }}
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
    </div>
  );
}

