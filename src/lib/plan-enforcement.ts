import {prisma} from "@/lib/prisma";
import {getPlanConfig} from "@/lib/plans";

type PlanResource = "tours" | "bookings" | "staff";

export type PlanLimitResult =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      limit: number;
      current: number;
      resource: PlanResource;
    };

export async function checkPlanLimit(tenantId: string, resource: PlanResource) {
  const tenant = await prisma.tenant.findUnique({
    where: {id: tenantId},
    select: {
      id: true,
      plan: true,
    },
  });

  if (!tenant) {
    const result: PlanLimitResult = {
      allowed: false,
      limit: 0,
      current: 0,
      resource,
    };

    return result;
  }

  const config = getPlanConfig(tenant.plan);
  const limit = config.limits[resource];

  if (limit < 0) {
    const result: PlanLimitResult = {
      allowed: true,
    };

    return result;
  }

  let current = 0;

  if (resource === "tours") {
    current = await prisma.tour.count({
      where: {
        tenantId,
      },
    });
  } else if (resource === "bookings") {
    current = await prisma.booking.count({
      where: {
        tenantId,
      },
    });
  } else if (resource === "staff") {
    current = await prisma.user.count({
      where: {
        tenantId,
      },
    });
  }

  if (current >= limit) {
    const result: PlanLimitResult = {
      allowed: false,
      limit,
      current,
      resource,
    };

    return result;
  }

  const result: PlanLimitResult = {
    allowed: true,
  };

  return result;
}

