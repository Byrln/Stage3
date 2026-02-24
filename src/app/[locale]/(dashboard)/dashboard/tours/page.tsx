import type {Metadata} from "next";
import {notFound} from "next/navigation";
import type {TourStatus} from "@prisma/client";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";
import {getTours} from "@/lib/db/queries/tours";
import {locales, type AppLocale} from "@/lib/i18n";
import type {SupportedCurrency} from "@/lib/currency";
import {ToursListClient} from "@/components/dashboard/tours/tours-list-client";

export const metadata: Metadata = {
  title: "Tours - Tripsaas",
};

type DashboardToursPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardToursPage(props: DashboardToursPageProps) {
  const {params} = props;
  const {locale} = await params;

  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  await requireAuth();

  const tenantContext = await getCurrentTenant();

  if (!tenantContext) {
    notFound();
  }

  const tenant = await getTenantBySlug(tenantContext.slug);

  if (!tenant) {
    notFound();
  }

  const tours = await getTours(tenant.id);

  const rows = tours.map((tour) => ({
    id: tour.id,
    title: tour.title,
    slug: tour.slug,
    shortDescription: tour.shortDescription,
    price: tour.price,
    compareAtPrice: tour.compareAtPrice ?? null,
    currency: tour.currency as SupportedCurrency,
    duration: tour.duration,
    maxGroupSize: tour.maxGroupSize ?? null,
    status: tour.status as TourStatus,
    rating: tour.rating ?? null,
    reviewCount: tour.reviewCount,
    destinations: tour.destinations,
    countries: tour.countries,
    categories: tour.categories,
    imageUrl: tour.imageUrls[0] ?? null,
    createdAt: tour.createdAt.toISOString(),
  }));

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">
            Tours
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Manage your tour products, pricing, and availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/${locale}/dashboard/tours/new`}
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <span>Add new tour</span>
          </a>
        </div>
      </header>

      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
        <ToursListClient
          locale={locale}
          tenantDefaultCurrency={tenant.defaultCurrency as SupportedCurrency}
          tours={rows}
        />
      </section>
    </main>
  );
}

