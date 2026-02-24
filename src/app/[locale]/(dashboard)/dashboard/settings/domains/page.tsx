import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {requireTenantSession} from "@/lib/auth/session";
import {locales, type AppLocale} from "@/lib/i18n";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Custom domains - Tripsaas",
};

type DomainsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DomainsPage(props: DomainsPageProps) {
  const {params} = props;
  const {locale} = await params;

  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  const session = await requireTenantSession();
  const tenantId = session.tenant.id;

  const domain = await prisma.customDomain.findFirst({
    where: {
      tenantId,
    },
  });

  async function handleSubmit(formData: FormData) {
    "use server";

    const rawDomain = (formData.get("domain") as string) ?? "";
    const normalized = rawDomain.trim().toLowerCase();

    if (!normalized) {
      return;
    }

    await prisma.customDomain.upsert({
      where: {
        tenantId,
      },
      create: {
        tenantId,
        hostname: normalized,
        verified: false,
        verificationToken: `mock_${Date.now().toString(36)}`,
      },
      update: {
        hostname: normalized,
        verified: false,
      },
    });
  }

  async function handleVerify() {
    "use server";

    const existing = await prisma.customDomain.findFirst({
      where: {tenantId},
    });

    if (!existing) {
      return;
    }

    await prisma.customDomain.update({
      where: {id: existing.id},
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });
  }

  return (
    <main className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl tracking-tight text-neutral-50">
            Custom domain
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Connect a branded domain and keep your booking experience on-brand.
          </p>
        </div>
      </header>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs font-semibold text-neutral-100">Domain</p>
          <p className="text-[11px] text-neutral-400">
            Enter the domain that should point to your Tripsaas workspace.
          </p>

          <form className="mt-2 space-y-2" action={handleSubmit}>
            <label className="block text-[11px] text-neutral-300">
              Custom domain
              <input
                name="domain"
                defaultValue={domain?.hostname ?? ""}
                placeholder="example.com"
                className="mt-1 h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </label>
            <button
              type="submit"
              className="h-9 rounded-full bg-emerald-500 px-4 text-[11px] font-semibold text-neutral-950 hover:bg-emerald-400"
            >
              Save domain
            </button>
          </form>

          <div className="mt-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-200">
            <p className="text-[11px] font-semibold text-neutral-100">DNS records</p>
            <p className="mt-1 text-[11px] text-neutral-400">
              Configure these DNS records with your provider, then click verify. This is a
              mock flow; in production you should validate DNS before marking the domain as
              active.
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full border-collapse text-[11px]">
                <thead className="bg-neutral-900/70 text-neutral-400">
                  <tr>
                    <th className="px-2 py-1 text-left">Type</th>
                    <th className="px-2 py-1 text-left">Host</th>
                    <th className="px-2 py-1 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-neutral-800">
                    <td className="px-2 py-1">A</td>
                    <td className="px-2 py-1">@</td>
                    <td className="px-2 py-1">203.0.113.10</td>
                  </tr>
                  <tr className="border-t border-neutral-800">
                    <td className="px-2 py-1">CNAME</td>
                    <td className="px-2 py-1">www</td>
                    <td className="px-2 py-1">app.tripsaas.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs font-semibold text-neutral-100">Status</p>
          <p className="text-[11px] text-neutral-400">
            Verification is mocked for now. Replace this with DNS-based checks.
          </p>

          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 ${
                domain?.verified
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-amber-500/10 text-amber-300"
              }`}
            >
              {domain?.verified ? "Verified" : "Pending verification"}
            </span>
          </div>

          <form action={handleVerify}>
            <button
              type="submit"
              className="mt-2 h-9 rounded-full border border-neutral-700 bg-neutral-950 px-4 text-[11px] font-semibold text-neutral-100 hover:bg-neutral-900"
            >
              Verify domain (mock)
            </button>
          </form>

          <div className="mt-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-200">
            <p className="text-[11px] font-semibold text-neutral-100">Provider guides</p>
            <p className="mt-1 text-[11px] text-neutral-400">
              Steps are similar across providers. Use these as a starting point.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-neutral-300">
              <li>GoDaddy: Add the A and CNAME records shown above.</li>
              <li>Cloudflare: Add records, then proxy traffic to your Tripsaas instance.</li>
              <li>Route 53: Create records in the hosted zone for your domain.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

