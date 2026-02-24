import {headers} from "next/headers";
import {auth} from "../../../auth";
import {getTenantBySlug} from "@/lib/db/queries/tenants";

export type CurrentTenant = {
  id: string;
  slug: string;
};

export async function getCurrentTenant(): Promise<CurrentTenant | null> {
  const headersList = await headers();
  const headerSlug = headersList.get("x-tenant-slug");

  if (headerSlug) {
    const tenant = await getTenantBySlug(headerSlug);

    if (!tenant) {
      return null;
    }

    return {
      id: tenant.id,
      slug: tenant.slug,
    };
  }

  const session = await auth();

  if (session?.user && "tenantId" in session.user && "tenantSlug" in session.user) {
    const tenantId = String((session.user as any).tenantId);
    const tenantSlug = String((session.user as any).tenantSlug);

    if (tenantId && tenantSlug) {
      return {
        id: tenantId,
        slug: tenantSlug,
      };
    }
  }

  const defaultTenant = await getTenantBySlug("mongoliatours");

  if (!defaultTenant) {
    return null;
  }

  return {
    id: defaultTenant.id,
    slug: defaultTenant.slug,
  };
}
