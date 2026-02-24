import {prisma} from "@/lib/prisma";
import type {Tour, Vendor, VendorType} from "@prisma/client";

export type VendorWithTours = Vendor & {
  tourVendors: {
    id: string;
    tour: Tour;
  }[];
};

export async function getVendors(tenantId: string): Promise<VendorWithTours[]> {
  const vendors = await prisma.vendor.findMany({
    where: {tenantId},
    orderBy: {createdAt: "desc"},
    include: {
      tourVendors: {
        include: {
          tour: true,
        },
      },
    },
  });

  return vendors as VendorWithTours[];
}

export async function getVendorById(
  tenantId: string,
  vendorId: string,
): Promise<VendorWithTours | null> {
  const vendor = await prisma.vendor.findFirst({
    where: {
      id: vendorId,
      tenantId,
    },
    include: {
      tourVendors: {
        include: {
          tour: true,
        },
      },
    },
  });

  return vendor as VendorWithTours | null;
}

export type UpsertVendorInput = {
  tenantId: string;
  id?: string;
  name: string;
  type: VendorType;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
  rating?: number;
  contractUrl?: string;
  contractExpiry?: Date | null;
  commissionRate: number;
  notes?: string;
  isActive: boolean;
};

export async function upsertVendor(input: UpsertVendorInput): Promise<Vendor> {
  const {tenantId, id, ...data} = input;

  if (id) {
    return prisma.vendor.update({
      where: {
        id,
        tenantId,
      },
      data,
    });
  }

  return prisma.vendor.create({
    data: {
      ...data,
      tenant: {
        connect: {id: tenantId},
      },
    },
  });
}

