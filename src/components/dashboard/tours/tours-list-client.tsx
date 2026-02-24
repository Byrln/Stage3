"use client";

import type {TourStatus} from "@prisma/client";
import {useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Search, Filter, ChevronDown} from "lucide-react";
import {sileo} from "sileo";
import {formatCurrency, type SupportedCurrency} from "@/lib/currency";

type ToursListRow = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  currency: SupportedCurrency;
  duration: number;
  maxGroupSize: number | null;
  status: TourStatus;
  rating: number | null;
  reviewCount: number;
  destinations: string[];
  countries: string[];
  categories: string[];
  imageUrl: string | null;
  createdAt: string;
};

type ToursListClientProps = {
  locale: string;
  tenantDefaultCurrency: SupportedCurrency;
  tours: ToursListRow[];
};

type StatusFilterValue = "all" | TourStatus;

type SortKey = "createdAt" | "title" | "price" | "rating";

type ColumnId =
  | "image"
  | "title"
  | "destinations"
  | "duration"
  | "price"
  | "capacity"
  | "status"
  | "rating"
  | "createdAt"
  | "actions";

type ColumnVisibilityState = Record<ColumnId, boolean>;

const DEFAULT_VISIBLE_COLUMNS: ColumnVisibilityState = {
  image: true,
  title: true,
  destinations: true,
  duration: true,
  price: true,
  capacity: true,
  status: true,
  rating: true,
  createdAt: true,
  actions: true,
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function ToursListClient(props: ToursListClientProps) {
  const {locale, tenantDefaultCurrency, tours} = props;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibilityState>(DEFAULT_VISIBLE_COLUMNS);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const availableStatuses: TourStatus[] = useMemo(() => {
    const set = new Set<TourStatus>();
    tours.forEach((tour) => set.add(tour.status));
    return Array.from(set).sort();
  }, [tours]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    tours.forEach((tour) => {
      tour.categories.forEach((category) => set.add(category));
    });
    return Array.from(set).sort();
  }, [tours]);

  const filteredTours = useMemo(() => {
    let result = tours;

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((tour) => {
        if (tour.title.toLowerCase().includes(query)) {
          return true;
        }
        if (tour.shortDescription.toLowerCase().includes(query)) {
          return true;
        }
        if (tour.destinations.some((destination) => destination.toLowerCase().includes(query))) {
          return true;
        }
        return false;
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((tour) => tour.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((tour) => tour.categories.includes(categoryFilter));
    }

    if (sortKey === "createdAt") {
      result = [...result].sort((a, b) => {
        const left = new Date(a.createdAt).getTime();
        const right = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? left - right : right - left;
      });
    } else if (sortKey === "title") {
      result = [...result].sort((a, b) => {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      });
    } else if (sortKey === "price") {
      result = [...result].sort((a, b) => {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
      });
    } else if (sortKey === "rating") {
      result = [...result].sort((a, b) => {
        const left = a.rating ?? 0;
        const right = b.rating ?? 0;
        return sortDirection === "asc" ? left - right : right - left;
      });
    }

    return result;
  }, [tours, searchQuery, statusFilter, categoryFilter, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredTours.length / pageSize));

  const currentPageIndex = Math.min(pageIndex, totalPages - 1);

  const paginatedTours = useMemo(() => {
    const start = currentPageIndex * pageSize;
    const end = start + pageSize;
    return filteredTours.slice(start, end);
  }, [filteredTours, currentPageIndex, pageSize]);

  function toggleSelectAll() {
    if (selectedIds.size === paginatedTours.length) {
      setSelectedIds(new Set());
      return;
    }

    const next = new Set<string>();
    paginatedTours.forEach((tour) => next.add(tour.id));
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

  function handleBulkAction(action: "publish" | "archive" | "delete") {
    if (selectedIds.size === 0) {
      return;
    }

    if (action === "delete") {
      sileo.error({
        title: "Delete tours",
        description: "Deleting tours cannot be undone. Wire this to an API route.",
      });
      return;
    }

    sileo.info({
      title: action === "publish" ? "Publish tours" : "Archive tours",
      description: "Bulk tour updates can be wired to TanStack Query mutations.",
    });
  }

  function handleColumnVisibilityChange(columnId: ColumnId) {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }

  function handleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDirection(nextKey === "title" ? "asc" : "desc");
  }

  function navigateToEdit(id: string) {
    router.push(`/${locale}/dashboard/tours/${id}/edit`);
  }

  function navigateToPublic(slug: string) {
    router.push(`/${locale}/tours/${slug}`);
  }

  return (
    <div className="space-y-4">
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
                router.replace(`/${locale}/dashboard/tours?${next.toString()}`);
              }}
              placeholder="Search tours or destinations"
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
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-300">
              <span className="text-neutral-400">Category</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="bg-transparent text-[11px] outline-none"
              >
                <option value="all">All</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-300"
            >
              <span>Columns</span>
              <ChevronDown className="h-3 w-3 text-neutral-500" />
            </button>
            <div className="absolute right-0 z-10 mt-1 w-44 rounded-2xl border border-neutral-800 bg-neutral-950 p-2 text-[11px] text-neutral-200 shadow-xl">
              {(
                [
                  ["Image", "image"],
                  ["Title", "title"],
                  ["Destinations", "destinations"],
                  ["Duration", "duration"],
                  ["Price", "price"],
                  ["Capacity", "capacity"],
                  ["Status", "status"],
                  ["Rating", "rating"],
                  ["Created", "createdAt"],
                  ["Actions", "actions"],
                ] as [string, ColumnId][]
              ).map(([label, id]) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-xl px-2 py-1 hover:bg-neutral-900"
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={visibleColumns[id]}
                    onChange={() => handleColumnVisibilityChange(id)}
                    className="h-3.5 w-3.5 rounded border-neutral-600 text-emerald-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-200">
              <span>{selectedIds.size} selected</span>
              <button
                type="button"
                className="rounded-full px-2 py-0.5 hover:bg-emerald-500/20"
                onClick={() => handleBulkAction("publish")}
              >
                Publish
              </button>
              <button
                type="button"
                className="rounded-full px-2 py-0.5 hover:bg-emerald-500/20"
                onClick={() => handleBulkAction("archive")}
              >
                Archive
              </button>
              <button
                type="button"
                className="rounded-full px-2 py-0.5 hover:bg-emerald-500/20"
                onClick={() => handleBulkAction("delete")}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800">
        <table className="min-w-full divide-y divide-neutral-800 text-xs">
          <thead className="bg-neutral-950/80 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-neutral-600 text-emerald-500"
                  checked={paginatedTours.length > 0 && selectedIds.size === paginatedTours.length}
                  onChange={toggleSelectAll}
                />
              </th>
              {visibleColumns.image && <th className="px-3 py-2 text-left">Image</th>}
              {visibleColumns.title && (
                <th className="px-3 py-2 text-left">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-neutral-200"
                    onClick={() => handleSort("title")}
                  >
                    <span>Title</span>
                  </button>
                </th>
              )}
              {visibleColumns.destinations && <th className="px-3 py-2 text-left">Destinations</th>}
              {visibleColumns.duration && <th className="px-3 py-2 text-left">Duration</th>}
              {visibleColumns.price && (
                <th className="px-3 py-2 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-neutral-200"
                    onClick={() => handleSort("price")}
                  >
                    <span>Price</span>
                  </button>
                </th>
              )}
              {visibleColumns.capacity && <th className="px-3 py-2 text-right">Capacity</th>}
              {visibleColumns.status && <th className="px-3 py-2 text-left">Status</th>}
              {visibleColumns.rating && (
                <th className="px-3 py-2 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-neutral-200"
                    onClick={() => handleSort("rating")}
                  >
                    <span>Rating</span>
                  </button>
                </th>
              )}
              {visibleColumns.createdAt && (
                <th className="px-3 py-2 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-neutral-200"
                    onClick={() => handleSort("createdAt")}
                  >
                    <span>Created</span>
                  </button>
                </th>
              )}
              {visibleColumns.actions && <th className="px-3 py-2 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 bg-neutral-950/60">
            {paginatedTours.length === 0 && (
              <tr>
                <td
                  colSpan={Object.values(visibleColumns).filter(Boolean).length + 2}
                  className="px-3 py-6 text-center text-[11px] text-neutral-500"
                >
                  No tours match the current filters.
                </td>
              </tr>
            )}

            {paginatedTours.map((tour) => {
              const isSelected = selectedIds.has(tour.id);

              return (
                <tr key={tour.id} className="text-[11px] text-neutral-100 hover:bg-neutral-900/80">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-neutral-600 text-emerald-500"
                      checked={isSelected}
                      onChange={() => toggleSelectRow(tour.id)}
                    />
                  </td>
                  {visibleColumns.image && (
                    <td className="px-3 py-2">
                      {tour.imageUrl ? (
                        <div className="h-10 w-16 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                          <img
                            src={tour.imageUrl}
                            alt={tour.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-16 items-center justify-center rounded-xl border border-dashed border-neutral-700 text-[10px] text-neutral-500">
                          No image
                        </div>
                      )}
                    </td>
                  )}
                  {visibleColumns.title && (
                    <td className="max-w-xs px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <span className="truncate text-xs font-semibold">{tour.title}</span>
                        <span className="line-clamp-2 text-[10px] text-neutral-400">
                          {tour.shortDescription}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.destinations && (
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {tour.destinations.slice(0, 3).map((destination) => (
                          <span
                            key={destination}
                            className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200"
                          >
                            {destination}
                          </span>
                        ))}
                        {tour.destinations.length > 3 && (
                          <span className="text-[10px] text-neutral-500">
                            +{tour.destinations.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.duration && (
                    <td className="whitespace-nowrap px-3 py-2 text-left text-[10px] text-neutral-300">
                      {tour.duration} days
                    </td>
                  )}
                  {visibleColumns.price && (
                    <td className="whitespace-nowrap px-3 py-2 text-right text-[10px]">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-neutral-50">
                          {formatCurrency(tour.price, tenantDefaultCurrency, locale)}
                        </span>
                        {tour.compareAtPrice && (
                          <span className="text-[9px] text-neutral-500 line-through">
                            {formatCurrency(tour.compareAtPrice, tenantDefaultCurrency, locale)}
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.capacity && (
                    <td className="whitespace-nowrap px-3 py-2 text-right text-[10px] text-neutral-300">
                      {tour.maxGroupSize ? `${tour.maxGroupSize} guests` : "N/A"}
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          tour.status === "PUBLISHED"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {tour.status.toLowerCase()}
                      </span>
                    </td>
                  )}
                  {visibleColumns.rating && (
                    <td className="whitespace-nowrap px-3 py-2 text-right text-[10px] text-neutral-300">
                      {tour.rating ? tour.rating.toFixed(1) : "–"}
                      {tour.reviewCount > 0 && (
                        <span className="ml-1 text-[9px] text-neutral-500">
                          ({tour.reviewCount})
                        </span>
                      )}
                    </td>
                  )}
                  {visibleColumns.createdAt && (
                    <td className="whitespace-nowrap px-3 py-2 text-right text-[10px] text-neutral-400">
                      {new Date(tour.createdAt).toLocaleDateString(locale)}
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-950 px-2 py-0.5 text-[10px] text-neutral-200">
                        <button
                          type="button"
                          className="rounded-full px-2 py-0.5 hover:bg-neutral-800"
                          onClick={() => navigateToEdit(tour.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-full px-2 py-0.5 hover:bg-neutral-800"
                          onClick={() => navigateToPublic(tour.slug)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-400">
        <div className="flex items-center gap-2">
          <span>
            Showing {paginatedTours.length} of {filteredTours.length} tours
          </span>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPageIndex(0);
            }}
            className="h-7 rounded-full border border-neutral-700 bg-neutral-950 px-2 text-[11px] outline-none"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPageIndex === 0}
            onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
            className="inline-flex h-7 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 px-2 text-[11px] text-neutral-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {currentPageIndex + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPageIndex >= totalPages - 1}
            onClick={() =>
              setPageIndex((index) => (index < totalPages - 1 ? index + 1 : index))
            }
            className="inline-flex h-7 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 px-2 text-[11px] text-neutral-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

