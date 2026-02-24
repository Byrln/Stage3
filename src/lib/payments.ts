import type {Plan} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {getPlanConfig} from "@/lib/plans";
import {enqueueEmail} from "@/lib/email/queue";

type PaymentMethodCard = {
  type: "card";
  cardholderName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
};

export type MockPaymentMethod = PaymentMethodCard;

export type MockPaymentResult =
  | {
      status: "succeeded";
      transactionId: string;
    }
  | {
      status: "failed";
      errorCode: string;
      errorMessage: string;
    };

export async function simulatePayment(method: MockPaymentMethod, amountCents: number) {
  const normalized = method.cardNumber.replace(/\s+/g, "");

  if (!normalized.startsWith("4242")) {
    const result: MockPaymentResult = {
      status: "failed",
      errorCode: "card_declined",
      errorMessage: "The card was declined in the mock gateway.",
    };

    return result;
  }

  const transactionId = `mock_${Date.now().toString(36)}`;

  const result: MockPaymentResult = {
    status: "succeeded",
    transactionId,
  };

  return result;
}

export async function upgradeTenantPlan(tenantId: string, plan: Plan) {
  const config = getPlanConfig(plan);

  const tenant = await prisma.tenant.update({
    where: {
      id: tenantId,
    },
    data: {
      plan,
      planExpiresAt: null,
      isActive: true,
    },
  });

  const adminUser = await prisma.user.findFirst({
    where: {
      tenantId,
      role: "ADMIN",
    },
  });

  const recipient = adminUser?.email;

  if (recipient) {
    const subject = `Your Tripsaas plan has been updated to ${plan}`;
    const html = `<p>Your workspace <strong>${tenant.name}</strong> is now on the <strong>${plan}</strong> plan at USD ${config.price} per month.</p>`;

    await enqueueEmail({
      tenantId,
      to: recipient,
      subject,
      html,
      templateName: "plan-upgrade",
      payload: {
        plan,
        price: config.price,
      },
    });
  }

  return tenant;
}

