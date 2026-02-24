import {prisma} from "@/lib/prisma";
import type {Tenant} from "@prisma/client";

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  return prisma.tenant.findUnique({
    where: {slug},
  });
}

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  return prisma.tenant.findUnique({
    where: {domain},
  });
}

