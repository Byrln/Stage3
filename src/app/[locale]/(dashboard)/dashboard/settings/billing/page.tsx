import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireTenantSession} from "@/lib/auth/session";
import {getPlanConfig, PLANS} from "@/lib/plans";
import {simulatePayment, upgradeTenantPlan} from "@/lib/payments";
import {prisma} from "@/lib/prisma";
import {locales, type AppLocale} from "@/lib/i18n";
import type {Plan} from "@prisma/client";

export const metadata: Metadata = {
  title: "Billing - Tripsaas",
};

type BillingPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function BillingPage(props: BillingPageProps) {
  const {params} = props;
  const {locale} = await params;

  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  const session = await requireTenantSession();
  const tenantId = session.tenant.id;

  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: {id: tenantId},
  });

  const currentPlanConfig = getPlanConfig(tenant.plan);

  const toursCount = await prisma.tour.count({
    where: {tenantId},
  });

  const bookingsCount = await prisma.booking.count({
    where: {tenantId},
  });

  const staffCount = await prisma.user.count({
    where: {tenantId},
  });

  const billingEntries = await prisma.billingEvent.findMany({
    where: {
      tenantId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">
            Billing and plans
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Manage your subscription, limits and invoices for this workspace.
          </p>
        </div>
      </header>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs font-semibold text-neutral-100">Current plan</p>
          <p className="text-[11px] text-neutral-400">
            You are currently on the {tenant.plan} plan.
          </p>

          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <UsageMeter
              label="Tours"
              used={toursCount}
              limit={currentPlanConfig.limits.tours}
            />
            <UsageMeter
              label="Bookings"
              used={bookingsCount}
              limit={currentPlanConfig.limits.bookings}
            />
            <UsageMeter
              label="Staff"
              used={staffCount}
              limit={currentPlanConfig.limits.staff}
            />
            <UsageMeter
              label="Storage"
              usedLabel="Usage"
              used={0}
              limitLabel={currentPlanConfig.limits.storage}
              limit={-1}
            />
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs font-semibold text-neutral-100">Subscription actions</p>
          <p className="text-[11px] text-neutral-400">
            These controls are wired for a mock payment flow. Replace with your gateway
            integration in production.
          </p>
          <form
            className="space-y-2"
            action={async (formData) => {
              "use server";

              const targetPlan = formData.get("plan") as Plan;
              const cardNumber = (formData.get("cardNumber") as string) ?? "";
              const cardholderName =
                (formData.get("cardholderName") as string) ?? "Tripsaas customer";

              const config = getPlanConfig(targetPlan);
              const amountCents = config.price * 100;

              const payment = await simulatePayment(
                {
                  type: "card",
                  cardholderName,
                  cardNumber,
                  expMonth: "01",
                  expYear: "30",
                  cvc: "123",
                },
                amountCents,
              );

              if (payment.status === "failed") {
                throw new Error(payment.errorMessage);
              }

              await upgradeTenantPlan(tenantId, targetPlan);

              await prisma.billingEvent.create({
                data: {
                  tenantId,
                  amountCents,
                  currency: "USD",
                  type: "SUBSCRIPTION_RENEWAL",
                  externalId: payment.transactionId,
                },
              });
            }}
          >
            <label className="block text-[11px] text-neutral-300">
              Choose plan
              <select
                name="plan"
                defaultValue={tenant.plan}
                className="mt-1 h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              >
                {Object.values(PLANS).map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.id} · ${plan.price}/month
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-[11px] text-neutral-300">
              Card number
              <input
                name="cardNumber"
                defaultValue="4242 4242 4242 4242"
                className="mt-1 h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </label>

            <label className="block text-[11px] text-neutral-300">
              Cardholder name
              <input
                name="cardholderName"
                defaultValue={session.user.name ?? ""}
                className="mt-1 h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </label>

            <button
              type="submit"
              className="mt-2 h-9 w-full rounded-full bg-emerald-500 text-[11px] font-semibold text-neutral-950 hover:bg-emerald-400"
            >
              Upgrade plan (mock payment)
            </button>
          </form>

          <form
            className="space-y-2"
            action={async () => {
              "use server";

              await prisma.tenant.update({
                where: {id: tenantId},
                data: {
                  isActive: false,
                },
              });
            }}
          >
            <p className="text-[11px] font-semibold text-neutral-100">
              Cancel subscription
            </p>
            <p className="text-[11px] text-neutral-400">
              Your workspace will remain accessible until the end of the billing period.
            </p>
            <textarea
              name="exitReason"
              className="mt-1 h-20 w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-[11px] text-neutral-100 outline-none"
              placeholder="Optional: Tell us why you are cancelling."
            />
            <button
              type="submit"
              className="h-9 w-full rounded-full border border-red-700 bg-red-950 text-[11px] font-semibold text-red-200 hover:bg-red-900"
            >
              Cancel subscription
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4">
        <p className="text-xs font-semibold text-neutral-100">Plan comparison</p>
        <p className="text-[11px] text-neutral-400">
          Compare plans and choose the right fit for your team.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          {Object.values(PLANS).map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3 text-[11px]"
            >
              <p className="text-[11px] font-semibold text-neutral-100">{plan.id}</p>
              <p className="mt-1 text-sm font-semibold text-neutral-50">
                ${plan.price}
                <span className="text-[10px] text-neutral-400">/month</span>
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-neutral-300">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4">
        <p className="text-xs font-semibold text-neutral-100">Billing history</p>
        <p className="text-[11px] text-neutral-400">
          Invoices generated by your current subscription. Replace with your provider&apos;s
          invoice portal in production.
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950/80">
          <table className="min-w-full border-collapse text-[11px] text-neutral-200">
            <thead className="bg-neutral-900/70 text-neutral-400">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {billingEntries.map((entry) => (
                <tr key={entry.id} className="border-t border-neutral-800">
                  <td className="px-3 py-2">
                    {entry.createdAt.toISOString().slice(0, 10)}
                  </td>
                  <td className="px-3 py-2">{entry.type}</td>
                  <td className="px-3 py-2 text-right">
                    ${(entry.amountCents / 100).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right text-emerald-300">Paid</td>
                </tr>
              ))}
              {billingEntries.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-[11px] text-neutral-500"
                  >
                    No billing entries yet. Upgrade your plan to generate invoices.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

type UsageMeterProps = {
  label: string;
  used: number;
  limit: number;
  usedLabel?: string;
  limitLabel?: string;
};

function UsageMeter(props: UsageMeterProps) {
  const {label, used, limit, usedLabel, limitLabel} = props;

  const isUnlimited = limit < 0;
  const ratio = isUnlimited || limit === 0 ? 0 : Math.min(1, used / limit);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-200">
      <p className="text-[11px] text-neutral-400">{label}</p>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-50">
          {usedLabel ?? "Used"} {used}
        </p>
        <p className="text-[10px] text-neutral-400">
          {isUnlimited ? "No limit" : `${limitLabel ?? "Limit"} ${limit}`}
        </p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-900">
        <div
          className={`h-full rounded-full ${
            ratio > 0.9
              ? "bg-red-500"
              : ratio > 0.7
                ? "bg-amber-500"
                : "bg-emerald-500"
          }`}
          style={{width: `${ratio * 100}%`}}
        />
      </div>
    </div>
  );
}

