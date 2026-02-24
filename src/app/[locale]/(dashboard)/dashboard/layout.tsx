import type {ReactNode} from "react";
import {notFound} from "next/navigation";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";
import {requireAuth} from "@/lib/auth/session";
import {getCurrentTenant} from "@/lib/auth/tenant";
import {getTenantBySlug} from "@/lib/db/queries/tenants";

type DashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const {children, params} = props;
  const {locale} = await params;

  const session = await requireAuth();
  const tenantContext = await getCurrentTenant();

  if (!tenantContext) {
    notFound();
  }

  const tenant = await getTenantBySlug(tenantContext.slug);

  if (!tenant) {
    notFound();
  }

  const user = session.user as {
    id: string;
    name?: string | null;
    role?: string | null;
  };

  return (
    <DashboardShell
      locale={locale}
      tenant={{
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        defaultCurrency: tenant.defaultCurrency,
      }}
      user={{
        id: user.id,
        name: user.name ?? "",
        role: user.role ?? "",
      }}
    >
      {children}
    </DashboardShell>
  );
}

