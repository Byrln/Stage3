import {prisma} from "@/lib/prisma";
import type {Booking, Customer, Prisma} from "@prisma/client";

export async function getCustomers(tenantId: string) {
  return prisma.customer.findMany({
    where: {tenantId},
    orderBy: {createdAt: "desc"},
  });
}

export type CustomerWithBookings = Customer & {
  bookings: Booking[];
};

export async function getCustomerWithBookings(
  tenantId: string,
  customerId: string,
): Promise<CustomerWithBookings | null> {
  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      tenantId,
    },
    include: {
      bookings: true,
    },
  });

  return customer as CustomerWithBookings | null;
}

export type UpsertCustomerInput = Omit<
  Prisma.CustomerCreateInput,
  "tenant" | "totalBookings" | "totalSpent"
> & {
  tenantId: string;
};

export async function upsertCustomer(input: UpsertCustomerInput): Promise<Customer> {
  const {tenantId, email, ...data} = input;

  return prisma.customer.upsert({
    where: {
      tenantId_email: {
        tenantId,
        email,
      },
    },
    update: data,
    create: {
      ...data,
      email,
      tenant: {
        connect: {id: tenantId},
      },
    },
  });
}
