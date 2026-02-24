import {auth} from "../../../auth";
import type {Role, Plan} from "@prisma/client";
import {redirect} from "next/navigation";
import type {Session} from "next-auth";

export async function getServerSession(): Promise<Session | null> {
  return auth();
}

export async function requireAuth(): Promise<Session> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return session;
}

export async function requireRole(requiredRoles: Role[]): Promise<Session> {
  const session = await requireAuth();

  const user = session.user as any;

  if (!user?.role || !requiredRoles.includes(user.role as Role)) {
    redirect("/auth/login");
  }

  return session;
}

export type TenantSession = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: Role;
  };
  tenant: {
    id: string;
    slug: string;
    name: string;
    plan: Plan;
  };
};

export async function requireTenantSession(): Promise<TenantSession> {
  const session = await requireAuth();
  const user = session.user as any;

  if (!user.tenantId) {
    redirect("/auth/login");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
    },
    tenant: {
      id: user.tenantId,
      slug: user.tenantSlug,
      name: user.tenantName,
      plan: user.plan,
    },
  };
}
