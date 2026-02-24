import nodemailer from "nodemailer";
import {prisma} from "@/lib/prisma";

type SendEmailInput = {
  tenantId: string;
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }[];
};

const transportPromise = createTransport();

function createTransport() {
  const host = process.env.EMAIL_SERVER_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_SERVER_PORT || "587");
  const user = process.env.EMAIL_SERVER_USER || "";
  const pass = process.env.EMAIL_SERVER_PASSWORD || "";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

async function enforceTenantRateLimit(tenantId: string) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const count = await prisma.emailQueue.count({
    where: {
      tenantId,
      status: "SENT",
      createdAt: {
        gte: oneHourAgo,
      },
    },
  });

  if (count >= 100) {
    throw new Error("Email rate limit exceeded for this tenant.");
  }
}

export async function sendEmail(input: SendEmailInput) {
  await enforceTenantRateLimit(input.tenantId);

  const transport = await transportPromise;

  await transport.sendMail({
    from: process.env.EMAIL_FROM || input.tenantId,
    to: input.to,
    subject: input.subject,
    html: input.html,
    attachments: input.attachments,
  });
}

