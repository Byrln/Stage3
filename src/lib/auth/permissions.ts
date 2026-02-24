import type {Role} from "@prisma/client";

export type Permission =
  | "manage:tenants"
  | "manage:tours"
  | "view:tours"
  | "manage:bookings"
  | "view:bookings"
  | "manage:customers"
  | "view:customers"
  | "manage:vendors"
  | "view:vendors"
  | "manage:staff"
  | "manage:support"
  | "view:reports";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPERADMIN: [
    "manage:tenants",
    "manage:tours",
    "view:tours",
    "manage:bookings",
    "view:bookings",
    "manage:customers",
    "view:customers",
    "manage:vendors",
    "view:vendors",
    "manage:staff",
    "manage:support",
    "view:reports",
  ],
  ADMIN: [
    "manage:tours",
    "view:tours",
    "manage:bookings",
    "view:bookings",
    "manage:customers",
    "view:customers",
    "manage:vendors",
    "view:vendors",
    "manage:staff",
    "view:reports",
  ],
  SALES: [
    "manage:bookings",
    "view:bookings",
    "view:customers",
    "view:tours",
  ],
  SUPPORT: [
    "view:bookings",
    "view:customers",
    "manage:support",
  ],
  USER: ["view:bookings"],
};

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];

  return permissions.includes(permission);
}

