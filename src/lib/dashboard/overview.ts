import {prisma} from "@/lib/prisma";
import type {BookingStatus} from "@prisma/client";

export type DashboardKpiSnapshot = {
  totalBookingsToday: number;
  totalBookingsYesterday: number;
  revenueMonthToDate: number;
  revenueLastMonth: number;
  activeTours: number;
  upcomingToursNext7Days: number;
  occupancyRate: number;
};

export type DashboardTrendPoint = {
  date: string;
  bookings: number;
  revenue: number;
};

export type DestinationRevenuePoint = {
  label: string;
  revenue: number;
  bookings: number;
};

export type RecentBookingRow = {
  id: string;
  bookingNumber: string;
  customerName: string;
  tourTitle: string;
  startDate: string;
  seats: number;
  amount: number;
  status: BookingStatus;
};

export type UpcomingTourRow = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  bookedSeats: number;
  capacity: number;
  revenue: number;
};

export type DashboardOverviewData = {
  kpis: DashboardKpiSnapshot;
  trends: DashboardTrendPoint[];
  destinationRevenue: DestinationRevenuePoint[];
  recentBookings: RecentBookingRow[];
  upcomingTours: UpcomingTourRow[];
};

type BookingWithTour = {
  id: string;
  startDate: Date;
  totalPrice: number;
  tour: {
    id: string;
    title: string;
  } | null;
};

type UpcomingBookingWithTour = {
  id: string;
  startDate: Date;
  endDate: Date;
  totalSeats: number;
  totalPrice: number;
  tour: {
    id: string;
    title: string;
    maxGroupSize: number | null;
  } | null;
};

type RecentBookingWithRelations = {
  id: string;
  bookingNumber: string;
  startDate: Date;
  totalSeats: number;
  totalPrice: number;
  status: BookingStatus;
  customer: {
    firstName: string;
    lastName: string;
  } | null;
  tour: {
    title: string;
  } | null;
};

function startOfDay(input: Date): Date {
  return new Date(input.getFullYear(), input.getMonth(), input.getDate());
}

function addDays(input: Date, days: number): Date {
  const result = new Date(input);
  result.setDate(result.getDate() + days);
  return result;
}

function startOfMonth(input: Date): Date {
  return new Date(input.getFullYear(), input.getMonth(), 1);
}

function startOfPreviousMonth(input: Date): Date {
  const month = input.getMonth() === 0 ? 11 : input.getMonth() - 1;
  const year = input.getMonth() === 0 ? input.getFullYear() - 1 : input.getFullYear();
  return new Date(year, month, 1);
}

function endOfPreviousMonth(input: Date): Date {
  const startPrev = startOfPreviousMonth(input);
  return new Date(startPrev.getFullYear(), startPrev.getMonth() + 1, 1);
}

export async function getDashboardOverviewData(tenantId: string): Promise<DashboardOverviewData> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const yesterdayStart = addDays(todayStart, -1);
  const monthStart = startOfMonth(now);
  const nextMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
  const previousMonthStart = startOfPreviousMonth(now);
  const previousMonthEnd = endOfPreviousMonth(now);
  const thirtyDaysAgo = addDays(todayStart, -29);
  const sevenDaysAhead = addDays(todayStart, 7);
  const thirtyDaysAhead = addDays(todayStart, 30);

  const confirmedStatuses: BookingStatus[] = ["CONFIRMED", "COMPLETED"] as BookingStatus[];

  const [
    bookingsToday,
    bookingsYesterday,
    revenueMonthToDateAggregate,
    revenueLastMonthAggregate,
    tours,
    bookingsLast30DaysRaw,
    upcomingBookingsRaw,
    recentBookingsRaw,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        tenantId,
        startDate: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    }),
    prisma.booking.count({
      where: {
        tenantId,
        startDate: {
          gte: yesterdayStart,
          lt: todayStart,
        },
      },
    }),
    prisma.booking.aggregate({
      where: {
        tenantId,
        startDate: {
          gte: monthStart,
          lt: nextMonthStart,
        },
        status: {
          in: confirmedStatuses,
        },
      },
      _sum: {
        totalPrice: true,
      },
    }),
    prisma.booking.aggregate({
      where: {
        tenantId,
        startDate: {
          gte: previousMonthStart,
          lt: previousMonthEnd,
        },
        status: {
          in: confirmedStatuses,
        },
      },
      _sum: {
        totalPrice: true,
      },
    }),
    prisma.tour.findMany({
      where: {tenantId},
      select: {
        id: true,
        title: true,
        maxGroupSize: true,
      },
    }),
    prisma.booking.findMany({
      where: {
        tenantId,
        startDate: {
          gte: thirtyDaysAgo,
          lt: tomorrowStart,
        },
      },
      select: {
        id: true,
        startDate: true,
        totalPrice: true,
        tour: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    }),
    prisma.booking.findMany({
      where: {
        tenantId,
        startDate: {
          gte: todayStart,
          lt: thirtyDaysAhead,
        },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        totalSeats: true,
        totalPrice: true,
        tour: {
          select: {
            id: true,
            title: true,
            maxGroupSize: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    }),
    prisma.booking.findMany({
      where: {
        tenantId,
      },
      include: {
        customer: true,
        tour: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ]);

  const bookingsLast30Days = bookingsLast30DaysRaw as unknown as BookingWithTour[];
  const upcomingBookings = upcomingBookingsRaw as unknown as UpcomingBookingWithTour[];
  const recentBookings = recentBookingsRaw as unknown as RecentBookingWithRelations[];

  const revenueMonthToDate = revenueMonthToDateAggregate._sum.totalPrice ?? 0;
  const revenueLastMonth = revenueLastMonthAggregate._sum.totalPrice ?? 0;

  const trendByDate = new Map<string, {bookings: number; revenue: number}>();
  bookingsLast30Days.forEach((booking) => {
    const dayKey = startOfDay(booking.startDate).toISOString().slice(0, 10);
    const current = trendByDate.get(dayKey) ?? {bookings: 0, revenue: 0};
    current.bookings += 1;
    current.revenue += booking.totalPrice;
    trendByDate.set(dayKey, current);
  });

  const trends: DashboardTrendPoint[] = [];
  for (let i = 0; i < 30; i += 1) {
    const date = addDays(thirtyDaysAgo, i);
    const key = date.toISOString().slice(0, 10);
    const values = trendByDate.get(key) ?? {bookings: 0, revenue: 0};
    trends.push({
      date: key,
      bookings: values.bookings,
      revenue: values.revenue,
    });
  }

  const destinationMap = new Map<string, {revenue: number; bookings: number}>();
  bookingsLast30Days.forEach((booking) => {
    const label = booking.tour?.title ?? "Unknown";
    const current = destinationMap.get(label) ?? {revenue: 0, bookings: 0};
    current.revenue += booking.totalPrice;
    current.bookings += 1;
    destinationMap.set(label, current);
  });

  const destinationRevenue: DestinationRevenuePoint[] = Array.from(destinationMap.entries())
    .map(([label, value]) => ({
      label,
      revenue: value.revenue,
      bookings: value.bookings,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const upcomingByTour = new Map<
    string,
    {
      title: string;
      startDate: Date;
      endDate: Date;
      bookedSeats: number;
      capacity: number;
      revenue: number;
    }
  >();

  upcomingBookings.forEach((booking) => {
    if (!booking.tour) {
      return;
    }

    const tourId = booking.tour.id;
    const existing = upcomingByTour.get(tourId);
    const nextStart = booking.startDate;
    const nextEnd = booking.endDate;
    const capacity = booking.tour.maxGroupSize ?? 0;

    if (!existing) {
      upcomingByTour.set(tourId, {
        title: booking.tour.title,
        startDate: nextStart,
        endDate: nextEnd,
        bookedSeats: booking.totalSeats,
        capacity,
        revenue: booking.totalPrice,
      });
      return;
    }

    if (nextStart < existing.startDate) {
      existing.startDate = nextStart;
    }

    if (nextEnd > existing.endDate) {
      existing.endDate = nextEnd;
    }

    existing.bookedSeats += booking.totalSeats;
    existing.revenue += booking.totalPrice;
    existing.capacity = capacity;
  });

  const upcomingTours: UpcomingTourRow[] = Array.from(upcomingByTour.values())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 10)
    .map((item) => ({
      id: item.title,
      title: item.title,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate.toISOString(),
      bookedSeats: item.bookedSeats,
      capacity: item.capacity,
      revenue: item.revenue,
    }));

  let totalCapacity = 0;
  let totalBookedSeats = 0;

  tours.forEach((tour) => {
    const capacity = tour.maxGroupSize ?? 0;
    if (capacity > 0) {
      totalCapacity += capacity;
    }
  });

  upcomingTours.forEach((tour) => {
    totalBookedSeats += tour.bookedSeats;
  });

  const occupancyRate =
    totalCapacity > 0 ? Math.round((totalBookedSeats / totalCapacity) * 100) : 0;

  const recentBookingsRows: RecentBookingRow[] = recentBookings.map((booking) => ({
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    customerName: booking.customer
      ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim()
      : "",
    tourTitle: booking.tour ? booking.tour.title : "",
    startDate: booking.startDate.toISOString(),
    seats: booking.totalSeats,
    amount: booking.totalPrice,
    status: booking.status,
  }));

  const kpis: DashboardKpiSnapshot = {
    totalBookingsToday: bookingsToday,
    totalBookingsYesterday: bookingsYesterday,
    revenueMonthToDate,
    revenueLastMonth,
    activeTours: tours.length,
    upcomingToursNext7Days: upcomingBookings.filter(
      (booking) =>
        booking.startDate >= todayStart && booking.startDate < sevenDaysAhead,
    ).length,
    occupancyRate,
  };

  return {
    kpis,
    trends,
    destinationRevenue,
    recentBookings: recentBookingsRows,
    upcomingTours,
  };
}
