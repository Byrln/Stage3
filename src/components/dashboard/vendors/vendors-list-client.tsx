"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import type {VendorType} from "@prisma/client";
import {Grid3X3, List} from "lucide-react";

type VendorRow = {
  id: string;
  name: string;
  type: VendorType;
  email: string;
  phone: string;
  website: string;
  address: string;
  rating: number;
  contractExpiry: string | null;
  commissionRate: number;
  isActive: boolean;
  country: string;
  activeToursCount: number;
};

type VendorsListClientProps = {
  locale: string;
  vendors: VendorRow[];
};

type ViewMode = "grid" | "table";
type TypeFilter = "all" | VendorType;
type ActiveFilter = "all" | "active" | "inactive";

export function VendorsListClient(props: VendorsListClientProps) {
  const {locale, vendors} = props;
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

  const filtered = useMemo(() => {
    return vendors.filter((vendor) => {
      if (typeFilter !== "all" && vendor.type !== typeFilter) {
        return false;
      }
      if (activeFilter === "active" && !vendor.isActive) {
        return false;
      }
      if (activeFilter === "inactive" && vendor.isActive) {
        return false;
      }
      return true;
    });
  }, [vendors, typeFilter, activeFilter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
            className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
          >
            <option value="all">All types</option>
            <option value="HOTEL">Hotels</option>
            <option value="TRANSPORT">Transport</option>
            <option value="GUIDE">Guides</option>
            <option value="ACTIVITY">Activities</option>
            <option value="RESTAURANT">Restaurants</option>
          </select>
          <select
            value={activeFilter}
            onChange={(event) => setActiveFilter(event.target.value as ActiveFilter)}
            className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-[11px] ${
              viewMode === "grid"
                ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                : "border-neutral-700 bg-neutral-950 text-neutral-300"
            }`}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-[11px] ${
              viewMode === "table"
                ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                : "border-neutral-700 bg-neutral-950 text-neutral-300"
            }`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vendor) => (
            <button
              key={vendor.id}
              type="button"
              onClick={() => router.push(`/${locale}/dashboard/vendors/${vendor.id}`)}
              className="flex flex-col items-start gap-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-left text-[11px] text-neutral-200 hover:border-neutral-600 hover:bg-neutral-900"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-semibold text-neutral-100">
                    {vendor.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase() || "VD"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-50">{vendor.name}</span>
                    <span className="text-[10px] text-neutral-400">
                      {vendor.email || vendor.phone || "No contact info"}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    vendor.isActive
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {vendor.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-300">
                  {vendor.type}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {vendor.activeToursCount} tours
                </span>
              </div>
              <div className="flex w-full items-center justify-between gap-2 text-[10px] text-neutral-400">
                <span>Rating: {vendor.rating ? vendor.rating.toFixed(1) : "N/A"}</span>
                <span>{vendor.country || "No country"}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-6 text-center text-[11px] text-neutral-500">
              No vendors match the selected filters.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-800">
          <table className="min-w-full divide-y divide-neutral-800 text-xs">
            <thead className="bg-neutral-950/80">
              <tr className="text-[11px] text-neutral-400">
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-left font-medium">Rating</th>
                <th className="px-3 py-2 text-left font-medium">Country</th>
                <th className="px-3 py-2 text-right font-medium">Tours</th>
                <th className="px-3 py-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 bg-neutral-950/60">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-[11px] text-neutral-500"
                  >
                    No vendors to display.
                  </td>
                </tr>
              )}
              {filtered.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="cursor-pointer text-[11px] text-neutral-200 hover:bg-neutral-900/70"
                  onClick={() => router.push(`/${locale}/dashboard/vendors/${vendor.id}`)}
                >
                  <td className="px-3 py-2">{vendor.name}</td>
                  <td className="px-3 py-2">{vendor.type}</td>
                  <td className="px-3 py-2">
                    {vendor.rating ? vendor.rating.toFixed(1) : "N/A"}
                  </td>
                  <td className="px-3 py-2">{vendor.country || "—"}</td>
                  <td className="px-3 py-2 text-right">
                    {vendor.activeToursCount.toString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {vendor.isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

