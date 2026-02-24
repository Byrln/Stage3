import {NextResponse} from "next/server";
import {renderToStream} from "@react-pdf/renderer";
import {requireAuth} from "@/lib/auth/session";
import {prisma} from "@/lib/prisma";
import {createBookingVoucherDocument} from "@/lib/pdf/booking-voucher";
import {formatCurrency, type SupportedCurrency} from "@/lib/currency";

type BookingVoucherRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: BookingVoucherRouteContext) {
  const {id} = await context.params;

  const session = await requireAuth();

  const booking = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      tenant: true,
      customer: true,
      tour: true,
    },
  });

  if (!booking) {
    return new NextResponse("Not found", {status: 404});
  }

  const user = session.user as {
    tenantId?: string;
  };

  if (user.tenantId && booking.tenantId !== user.tenantId) {
    return new NextResponse("Forbidden", {status: 403});
  }

  const locale = "en";

  const amountFormatted = formatCurrency(
    booking.totalPrice,
    booking.currency as SupportedCurrency,
    locale,
  );

  const pdfStream = await renderToStream(
    createBookingVoucherDocument({
      tenantName: booking.tenant.name,
      tenantSlug: booking.tenant.slug,
      tenantEmail: booking.tenant.contactEmail,
      tenantPhone: booking.tenant.contactPhone ?? "",
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      customerName: `${booking.customer.firstName} ${booking.customer.lastName}`.trim(),
      customerEmail: booking.customer.email,
      tourTitle: booking.tour ? booking.tour.title : "",
      startDate: booking.startDate.toISOString().slice(0, 10),
      endDate: booking.endDate.toISOString().slice(0, 10),
      seats: booking.totalSeats,
      amountFormatted,
      meetingPoint: booking.tour?.meetingPoint ?? "",
      endPoint: booking.tour?.endPoint ?? "",
    }),
  );

  return new NextResponse(pdfStream as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="voucher-${booking.bookingNumber}.pdf"`,
    },
  });
}
