import {prisma} from "@/lib/prisma";
import {sendEmail} from "@/lib/email";

type EnqueueEmailInput = {
  tenantId: string;
  to: string;
  subject: string;
  html: string;
  templateName?: string;
  payload?: Record<string, unknown>;
};

export async function enqueueEmail(input: EnqueueEmailInput) {
  await prisma.emailQueue.create({
    data: {
      tenantId: input.tenantId,
      to: input.to,
      subject: input.subject,
      html: input.html,
      templateName: input.templateName ?? null,
      payload: input.payload ?? {},
      status: "PENDING",
      attempts: 0,
    },
  });
}

export async function processEmailQueue() {
  const now = new Date();

  const pending = await prisma.emailQueue.findMany({
    where: {
      status: "PENDING",
      OR: [
        {
          nextRetry: null,
        },
        {
          nextRetry: {
            lte: now,
          },
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 20,
  });

  let processed = 0;

  for (const item of pending) {
    try {
      await sendEmail({
        tenantId: item.tenantId,
        to: item.to,
        subject: item.subject,
        html: item.html,
      });

      await prisma.emailQueue.update({
        where: {
          id: item.id,
        },
        data: {
          status: "SENT",
          attempts: {
            increment: 1,
          },
        },
      });
      processed += 1;
    } catch (error) {
      const attempts = item.attempts + 1;
      const nextRetry =
        attempts >= 5 ? null : new Date(now.getTime() + attempts * 5 * 60 * 1000);

      await prisma.emailQueue.update({
        where: {
          id: item.id,
        },
        data: {
          status: attempts >= 5 ? "FAILED" : "PENDING",
          attempts,
          nextRetry,
        },
      });
    }
  }

  return {
    processed,
  };
}

