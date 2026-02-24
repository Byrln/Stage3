import type {Plan} from "@prisma/client";

type PlanLimits = {
  tours: number;
  bookings: number;
  staff: number;
  storage: string;
};

type PlanConfig = {
  id: Plan;
  price: number;
  limits: PlanLimits;
  features: string[];
};

export const PLANS: Record<Plan, PlanConfig> = {
  FREE: {
    id: "FREE",
    price: 0,
    limits: {
      tours: 3,
      bookings: 20,
      staff: 1,
      storage: "100MB",
    },
    features: ["basic dashboard", "email support"],
  },
  BASIC: {
    id: "BASIC",
    price: 29,
    limits: {
      tours: 20,
      bookings: 200,
      staff: 5,
      storage: "1GB",
    },
    features: ["all free", "analytics", "custom domain", "priority support"],
  },
  PRO: {
    id: "PRO",
    price: 99,
    limits: {
      tours: -1,
      bookings: -1,
      staff: 20,
      storage: "10GB",
    },
    features: ["all basic", "white label", "API access", "dedicated support"],
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    price: 299,
    limits: {
      tours: -1,
      bookings: -1,
      staff: -1,
      storage: "100GB",
    },
    features: ["all pro", "custom integrations", "SLA", "onboarding"],
  },
};

export function getPlanConfig(plan: Plan): PlanConfig {
  return PLANS[plan];
}

