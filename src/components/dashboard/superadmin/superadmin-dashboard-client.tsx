"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {exportToCSV} from "@/lib/export";
import {sileo} from "sileo";

type TenantStatus = "ACTIVE" | "TRIAL" | "CHURNED";

type SuperadminTenantRow = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  planPrice: number;
  createdAt: string;
  bookingsCount: number;
  revenue: number;
  lastActiveAt: string;
  status: TenantStatus;
  toursCount: number;
  staffCount: number;
  storageLimit: string;
};

type GrowthPoint = {
  month: string;
  count: number;
};

type PlanDistributionPoint = {
  plan: string;
  count: number;
  price: number;
};

type TopTenantPoint = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  revenue: number;
};

type SuperadminDashboardData = {
  currentUserName?: string;
  kpis: {
    totalTenants: number;
    tenantsActive: number;
    tenantsTrial: number;
    tenantsChurned: number;
    mrr: number;
    totalBookings: number;
    platformRevenue: number;
  };
  tenants: SuperadminTenantRow[];
  analytics: {
    growthSeries: GrowthPoint[];
    planDistribution: PlanDistributionPoint[];
    topTenantsByRevenue: TopTenantPoint[];
  };
};

type SuperadminDashboardClientProps = {
  locale: string;
  data: SuperadminDashboardData;
};

type PlanFilter = "ALL" | "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
type StatusFilter = "ALL" | TenantStatus;
type DateRangeFilter = "all" | "30d" | "90d" | "365d";

export function SuperadminDashboardClient(props: SuperadminDashboardClientProps) {
  const {locale, data} = props;
  const router = useRouter();
  const [planFilter, setPlanFilter] = useState<PlanFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>("90d");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const selectedTenant = useMemo(
    () => data.tenants.find((tenant) => tenant.id === selectedTenantId) ?? null,
    [data.tenants, selectedTenantId],
  );

  const filteredTenants = useMemo(() => {
    const now = new Date();

    function withinRange(tenant: SuperadminTenantRow) {
      if (dateRangeFilter === "all") {
        return true;
      }

      const createdAt = new Date(tenant.createdAt);
      const diffMs = now.getTime() - createdAt.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (dateRangeFilter === "30d") {
        return diffDays <= 30;
      }
      if (dateRangeFilter === "90d") {
        return diffDays <= 90;
      }
      if (dateRangeFilter === "365d") {
        return diffDays <= 365;
      }

      return true;
    }

    return data.tenants.filter((tenant) => {
      if (planFilter !== "ALL" && tenant.plan !== planFilter) {
        return false;
      }

      if (statusFilter !== "ALL" && tenant.status !== statusFilter) {
        return false;
      }

      if (!withinRange(tenant)) {
        return false;
      }

      if (searchQuery) {
        const normalized = searchQuery.toLowerCase();
        const haystack = `${tenant.name} ${tenant.slug}`.toLowerCase();
        if (!haystack.includes(normalized)) {
          return false;
        }
      }

      return true;
    });
  }, [data.tenants, planFilter, statusFilter, dateRangeFilter, searchQuery]);

  function handleExportCsv() {
    if (filteredTenants.length === 0) {
      sileo.info({
        title: "No tenants to export",
        description: "Adjust filters to include at least one tenant.",
      });
      return;
    }

    exportToCSV(filteredTenants, "tenants", [
      {key: "name", label: "Tenant"},
      {key: "slug", label: "Slug"},
      {key: "plan", label: "Plan"},
      {key: "planPrice", label: "Plan price"},
      {key: "createdAt", label: "Created at"},
      {key: "bookingsCount", label: "Bookings"},
      {key: "revenue", label: "Revenue"},
      {key: "lastActiveAt", label: "Last active"},
      {key: "status", label: "Status"},
    ]);
  }

  const churnRate =
    data.kpis.totalTenants === 0
      ? 0
      : (data.kpis.tenantsChurned / data.kpis.totalTenants) * 100;

  const statusSummary = [
    {
      label: "Active",
      value: data.kpis.tenantsActive,
    },
    {
      label: "Trial",
      value: data.kpis.tenantsTrial,
    },
    {
      label: "Churned",
      value: data.kpis.tenantsChurned,
    },
  ];

  const planColors: Record<string, string> = {
    FREE: "#9CA3AF",
    BASIC: "#22C55E",
    PRO: "#3B82F6",
    ENTERPRISE: "#F97316",
  };

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">
            SuperAdmin overview
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Platform-wide health, revenue and tenant performance.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-neutral-300">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
            {data.kpis.totalTenants} tenants
          </span>
          {data.currentUserName && (
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-neutral-300">
              Signed in as {data.currentUserName}
            </span>
          )}
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-4">
        <KpiCard
          label="Total tenants"
          value={data.kpis.totalTenants.toString()}
          helper={`${data.kpis.tenantsActive} active • ${data.kpis.tenantsTrial} trial • ${data.kpis.tenantsChurned} churned`}
        />
        <KpiCard
          label="MRR"
          value={`$${data.kpis.mrr.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}
          helper="Approximate recurring revenue per month"
        />
        <KpiCard
          label="Total bookings"
          value={data.kpis.totalBookings.toString()}
          helper="Across all tenants"
        />
        <KpiCard
          label="Platform revenue"
          value={`$${data.kpis.platformRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}
          helper="Assuming 5% commission"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-neutral-100">Tenants</p>
              <p className="text-[11px] text-neutral-400">
                High-level view of all workspaces on the platform.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name or slug"
                className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
              <select
                value={planFilter}
                onChange={(event) => setPlanFilter(event.target.value as PlanFilter)}
                className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-2 text-[11px] text-neutral-100 outline-none"
              >
                <option value="ALL">All plans</option>
                <option value="FREE">Free</option>
                <option value="BASIC">Basic</option>
                <option value="PRO">Pro</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-2 text-[11px] text-neutral-100 outline-none"
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="TRIAL">Trial</option>
                <option value="CHURNED">Churned</option>
              </select>
              <select
                value={dateRangeFilter}
                onChange={(event) =>
                  setDateRangeFilter(event.target.value as DateRangeFilter)
                }
                className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-2 text-[11px] text-neutral-100 outline-none"
              >
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="365d">Last 12 months</option>
                <option value="all">All time</option>
              </select>
              <button
                type="button"
                onClick={handleExportCsv}
                className="h-8 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 hover:border-neutral-500 hover:bg-neutral-900"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950/60">
            <table className="min-w-full border-collapse text-[11px] text-neutral-200">
              <thead className="bg-neutral-900/70 text-neutral-400">
                <tr>
                  <th className="px-3 py-2 text-left">Tenant</th>
                  <th className="px-3 py-2 text-left">Plan</th>
                  <th className="px-3 py-2 text-right">Bookings</th>
                  <th className="px-3 py-2 text-right">Revenue</th>
                  <th className="px-3 py-2 text-left">Last active</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-6 text-center text-[11px] text-neutral-500"
                    >
                      No tenants match the current filters.
                    </td>
                  </tr>
                )}
                {filteredTenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="cursor-pointer border-t border-neutral-800 text-[11px] hover:bg-neutral-900/70"
                    onClick={() => setSelectedTenantId(tenant.id)}
                  >
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-neutral-100">
                          {tenant.name}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {tenant.slug}.tripsaas.com
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px]"
                        style={{
                          backgroundColor: `${planColors[tenant.plan] || "#374151"}20`,
                          color: planColors[tenant.plan] || "#E5E7EB",
                        }}
                      >
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      {tenant.bookingsCount.toString()}
                    </td>
                    <td className="px-3 py-2 text-right">
                      ${tenant.revenue.toLocaleString("en-US", {maximumFractionDigits: 0})}
                    </td>
                    <td className="px-3 py-2 text-left text-neutral-400">
                      {new Date(tenant.lastActiveAt).toLocaleString(locale)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                          tenant.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : tenant.status === "TRIAL"
                              ? "bg-amber-500/10 text-amber-300"
                              : "bg-red-500/10 text-red-300"
                        }`}
                      >
                        {tenant.status === "ACTIVE"
                          ? "Active"
                          : tenant.status === "TRIAL"
                            ? "Trial"
                            : "Churned"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="rounded-full border border-neutral-700 bg-neutral-950 px-2 py-0.5 text-[10px] text-neutral-100 hover:border-neutral-500 hover:bg-neutral-900"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedTenantId(tenant.id);
                          }}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-neutral-700 bg-neutral-950 px-2 py-0.5 text-[10px] text-neutral-100 hover:border-neutral-500 hover:bg-neutral-900"
                          onClick={(event) => {
                            event.stopPropagation();
                            sileo.info({
                              title: "Upgrade plan",
                              description:
                                "Wire this action to the billing upgrade flow for the selected tenant.",
                            });
                          }}
                        >
                          Upgrade
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-red-700 bg-red-950 px-2 py-0.5 text-[10px] text-red-200 hover:border-red-500 hover:bg-red-900"
                          onClick={(event) => {
                            event.stopPropagation();
                            sileo.info({
                              title: "Suspend tenant",
                              description:
                                "Wire this action to a backend job that marks the tenant as suspended.",
                            });
                          }}
                        >
                          Suspend
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {statusSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-3 py-2 text-[11px]"
              >
                <p className="text-neutral-400">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-neutral-50">
                  {item.value.toString()}
                </p>
              </div>
            ))}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-3 py-2 text-[11px]">
              <p className="text-neutral-400">Churn rate</p>
              <p className="mt-1 text-sm font-semibold text-neutral-50">
                {churnRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs font-semibold text-neutral-100">Platform analytics</p>
          <p className="text-[11px] text-neutral-400">
            Visual overview of tenant growth, plan mix and top accounts.
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.analytics.growthSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" tick={{fontSize: 10, fill: "#a1a1aa"}} />
                <YAxis tick={{fontSize: 10, fill: "#a1a1aa"}} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#27272a",
                    borderRadius: 12,
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#22c55e"
                  fill="#22c55e25"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.analytics.planDistribution}
                    dataKey="count"
                    nameKey="plan"
                    innerRadius={40}
                    outerRadius={60}
                  >
                    {data.analytics.planDistribution.map((entry) => (
                      <Cell
                        key={entry.plan}
                        fill={planColors[entry.plan] || "#4b5563"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderColor: "#27272a",
                      borderRadius: 12,
                      fontSize: 11,
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-[10px] text-neutral-300">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.analytics.topTenantsByRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="slug"
                    tick={{fontSize: 10, fill: "#a1a1aa"}}
                    tickFormatter={(value) => value.slice(0, 6)}
                  />
                  <YAxis tick={{fontSize: 10, fill: "#a1a1aa"}} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderColor: "#27272a",
                      borderRadius: 12,
                      fontSize: 11,
                    }}
                    formatter={(value: number) =>
                      `$${value.toLocaleString("en-US", {maximumFractionDigits: 0})}`
                    }
                  />
                  <Bar dataKey="revenue" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {selectedTenant && (
        <TenantDetailModal
          tenant={selectedTenant}
          onClose={() => setSelectedTenantId(null)}
        />
      )}
    </main>
  );
}

type KpiCardProps = {
  label: string;
  value: string;
  helper: string;
};

function KpiCard(props: KpiCardProps) {
  const {label, value, helper} = props;

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-200">
      <p className="text-[11px] text-neutral-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-neutral-50">{value}</p>
      <p className="mt-1 text-[11px] text-neutral-500">{helper}</p>
    </div>
  );
}

type TenantDetailModalProps = {
  tenant: SuperadminTenantRow;
  onClose: () => void;
};

function TenantDetailModal(props: TenantDetailModalProps) {
  const {tenant, onClose} = props;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-2">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-neutral-800 bg-neutral-950 p-4 text-[11px] text-neutral-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-neutral-100">{tenant.name}</p>
            <p className="text-[11px] text-neutral-400">
              {tenant.slug}.tripsaas.com · {tenant.plan} plan
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-100 hover:bg-neutral-900"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
            <p className="text-[11px] font-semibold text-neutral-100">Tenant details</p>
            <div className="grid gap-2 md:grid-cols-2">
              <DetailRow label="Slug" value={tenant.slug} />
              <DetailRow
                label="Created"
                value={new Date(tenant.createdAt).toLocaleString()}
              />
              <DetailRow
                label="Last active"
                value={new Date(tenant.lastActiveAt).toLocaleString()}
              />
              <DetailRow label="Status" value={tenant.status} />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <DetailRow
                label="Tours"
                value={tenant.toursCount.toString()}
              />
              <DetailRow
                label="Bookings"
                value={tenant.bookingsCount.toString()}
              />
              <DetailRow label="Staff" value={tenant.staffCount.toString()} />
            </div>
            <DetailRow label="Storage" value={tenant.storageLimit} />
          </div>

          <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
            <p className="text-[11px] font-semibold text-neutral-100">Actions</p>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-neutral-950 hover:bg-emerald-400"
                onClick={() =>
                  sileo.info({
                    title: "Impersonate tenant admin",
                    description:
                      "Wire this control to an impersonation flow that issues a scoped session for this tenant.",
                  })
                }
              >
                Impersonate tenant admin
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-100 hover:bg-neutral-900"
                onClick={() =>
                  sileo.info({
                    title: "Send announcement",
                    description:
                      "Wire this control to the email system to broadcast a platform update to this tenant.",
                  })
                }
              >
                Send announcement email
              </button>
            </div>
            <div className="space-y-1 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
              <p className="text-[11px] font-semibold text-neutral-100">Plan</p>
              <p className="text-[11px] text-neutral-400">
                Wire these buttons to the billing upgrade flow to change plan with immediate
                effect.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["FREE", "BASIC", "PRO", "ENTERPRISE"].map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-[11px] ${
                      tenant.plan === plan
                        ? "bg-emerald-500 text-neutral-950"
                        : "border border-neutral-700 bg-neutral-950 text-neutral-100 hover:bg-neutral-900"
                    }`}
                    onClick={() =>
                      sileo.info({
                        title: "Change plan",
                        description: `Change plan to ${plan} in billing backend.`,
                      })
                    }
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
            <p className="text-[11px] font-semibold text-neutral-100">Billing history</p>
            <p className="text-[11px] text-neutral-400">
              Mock billing entries. Wire this table to your billing provider&apos;s invoices.
            </p>
            <table className="mt-2 w-full border-collapse text-[11px] text-neutral-200">
              <thead className="bg-neutral-900/70 text-neutral-400">
                <tr>
                  <th className="px-2 py-1 text-left">Date</th>
                  <th className="px-2 py-1 text-left">Description</th>
                  <th className="px-2 py-1 text-right">Amount</th>
                  <th className="px-2 py-1 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-neutral-800">
                  <td className="px-2 py-1">2026-02-01</td>
                  <td className="px-2 py-1">Subscription renewal</td>
                  <td className="px-2 py-1 text-right">$ {tenant.planPrice}</td>
                  <td className="px-2 py-1 text-right text-emerald-300">Paid</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="px-2 py-1">2026-01-01</td>
                  <td className="px-2 py-1">Subscription renewal</td>
                  <td className="px-2 py-1 text-right">$ {tenant.planPrice}</td>
                  <td className="px-2 py-1 text-right text-emerald-300">Paid</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3">
            <p className="text-[11px] font-semibold text-neutral-100">Tenant usage</p>
            <p className="text-[11px] text-neutral-400">
              High-level usage metrics for support and success conversations.
            </p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <DetailRow
                label="Tours published"
                value={tenant.toursCount.toString()}
              />
              <DetailRow
                label="Bookings total"
                value={tenant.bookingsCount.toString()}
              />
              <DetailRow
                label="Team size"
                value={tenant.staffCount.toString()}
              />
              <DetailRow
                label="Gross revenue"
                value={`$${tenant.revenue.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow(props: DetailRowProps) {
  const {label, value} = props;

  return (
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <span className="text-neutral-400">{label}</span>
      <span className="text-neutral-100">{value}</span>
    </div>
  );
}

