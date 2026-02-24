import {prisma} from "@/lib/prisma";

type AuditJson = string | number | boolean | null | AuditJson[] | {[key: string]: AuditJson};

type AuditActionInput = {
  tenantId: string;
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  oldData?: AuditJson;
  newData?: AuditJson;
  ipAddress?: string | null;
};

export async function logAction(input: AuditActionInput) {
  await prisma.auditLog.create({
    data: {
      tenantId: input.tenantId,
      userId: input.userId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      oldData: input.oldData ?? undefined,
      newData: input.newData ?? undefined,
      ipAddress: input.ipAddress ?? null,
    },
  });
}
