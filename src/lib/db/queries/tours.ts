import {prisma} from "@/lib/prisma";
import type {Prisma, Tour} from "@prisma/client";

export async function getTours(tenantId: string) {
  return prisma.tour.findMany({
    where: {tenantId},
    orderBy: {createdAt: "desc"},
  });
}

export async function getTourBySlug(tenantId: string, slug: string) {
  return prisma.tour.findUnique({
    where: {
      tenantId_slug: {
        tenantId,
        slug,
      },
    },
  });
}

export type CreateTourInput = Omit<Prisma.TourCreateInput, "tenant"> & {
  tenantId: string;
};

export async function createTour(input: CreateTourInput): Promise<Tour> {
  const {tenantId, ...data} = input;

  return prisma.tour.create({
    data: {
      ...data,
      tenant: {
        connect: {id: tenantId},
      },
    },
  });
}

export type UpdateTourInput = Prisma.TourUpdateInput;

export async function updateTour(tenantId: string, tourId: string, data: UpdateTourInput): Promise<Tour> {
  return prisma.tour.update({
    where: {
      id: tourId,
      tenantId,
    },
    data,
  });
}

