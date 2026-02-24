"use client";

import {useState} from "react";
import type {VendorType} from "@prisma/client";
import {Globe2} from "lucide-react";

type VendorTour = {
  id: string;
  title: string;
};

type VendorDetail = {
  id: string;
  name: string;
  type: VendorType;
  email: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  rating: number;
  contractUrl: string;
  contractExpiry: string | null;
  commissionRate: number;
  notes: string;
  isActive: boolean;
  country: string;
  tours: VendorTour[];
};

type VendorDetailClientProps = {
  locale: string;
  vendor: VendorDetail;
};

export function VendorDetailClient(props: VendorDetailClientProps) {
  const {locale, vendor} = props;
  const [formState] = useState(vendor);

  return (
    <div className="space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-50">
            {vendor.name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() || "VD"}
          </div>
          <div>
            <h1 className="font-heading text-lg tracking-tight text-neutral-50">
              {vendor.name}
            </h1>
            <p className="mt-1 text-[11px] text-neutral-400">
              {vendor.type} · {vendor.country || "No country"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span
            className={`rounded-full px-3 py-1 ${
              vendor.isActive
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {vendor.isActive ? "Active" : "Inactive"}
          </span>
          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[11px] text-neutral-100 hover:bg-neutral-900"
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>Website</span>
            </a>
          )}
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-300">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Contact
            </p>
            <p>Email: {formState.email || "Not set"}</p>
            <p>Phone: {formState.phone || "Not set"}</p>
            <p>Address: {formState.address || "Not set"}</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-300">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Business
            </p>
            <p>Commission rate: {formState.commissionRate.toFixed(1)}%</p>
            <p>Rating: {formState.rating ? formState.rating.toFixed(1) : "N/A"}</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-300">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Contract
            </p>
            <p>
              Expires:{" "}
              {formState.contractExpiry
                ? new Date(formState.contractExpiry).toLocaleDateString(locale)
                : "N/A"}
            </p>
            <p>Contract file: {formState.contractUrl ? "Uploaded" : "Not uploaded"}</p>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-300">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Associated tours
            </p>
            {formState.tours.length === 0 && (
              <p className="text-[11px] text-neutral-500">
                Wire this list to drag-assign tours to this vendor.
              </p>
            )}
            <ul className="space-y-1">
              {formState.tours.map((tour) => (
                <li key={tour.id} className="rounded-full bg-neutral-900 px-3 py-1">
                  {tour.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-300">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Notes
            </p>
            <p>{formState.notes || "No internal notes yet."}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

