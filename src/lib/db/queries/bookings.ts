import {prisma} from "@/lib/prisma";
import type {Booking, BookingStatus, Customer, Prisma, Tour, User} from "@prisma/client";

export type BookingWithRelations = Booking & {
  tour: Tour | null;
  customer: Customer;
  assignedGuide: User | null;
};

export async function getBookings(tenantId: string): Promise<BookingWithRelations[]> {
  const bookings = await prisma.booking.findMany({
    where: {tenantId},
    orderBy: {createdAt: "desc"},
    include: {
      tour: true,
      customer: true,
      assignedGuide: true,
    },
  });

  return bookings as BookingWithRelations[];
}

export type CreateBookingInput = Omit<
  Prisma.BookingCreateInput,
  "tenant" | "tour" | "customer" | "assignedGuide"
> & {
  tenantId: string;
  tourId: string;
  customerId: string;
  assignedGuideId?: string | null;
};

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const {tenantId, tourId, customerId, assignedGuideId, ...data} = input;

  return prisma.booking.create({
    data: {
      ...data,
      tenant: {connect: {id: tenantId}},
      tour: {connect: {id: tourId}},
      customer: {connect: {id: customerId}},
      assignedGuide: assignedGuideId
        ? {
            connect: {id: assignedGuideId},
          }
        : undefined,
    },
  });
}

export async function updateBookingStatus(
  tenantId: string,
  bookingId: string,
  status: BookingStatus,
  internalNotes?: string,
): Promise<Booking> {
  return prisma.booking.update({
    where: {
      id: bookingId,
      tenantId,
    },
    data: {
      status,
      internalNotes: internalNotes ?? undefined,
      confirmedAt: status === "CONFIRMED" ? new Date() : undefined,
      cancelledAt: status === "CANCELLED" ? new Date() : undefined,
    },
  });
}
