import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBooking } from '@/lib/db/queries/bookings';
import { checkPlanLimit } from '@/lib/plan-enforcement';
import { prisma } from '@/lib/prisma';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    booking: {
      create: vi.fn(),
      count: vi.fn(),
    },
    tenant: {
      findUnique: vi.fn(),
    },
    tour: {
      count: vi.fn(),
    },
    user: {
      count: vi.fn(),
    },
  },
}));

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('enforces plan limits for bookings', async () => {
    // Setup tenant with FREE plan (limit 20 bookings)
    (prisma.tenant.findUnique as any).mockResolvedValue({
      id: 'tenant-1',
      plan: 'FREE',
    });

    // Mock current booking count = 20 (limit reached)
    (prisma.booking.count as any).mockResolvedValue(20);

    const result = await checkPlanLimit('tenant-1', 'bookings');
    expect(result.allowed).toBe(false);
    
    if (!result.allowed) {
        // Narrowing type for TS
        expect(result.limit).toBe(20);
        expect(result.current).toBe(20);
    }
  });

  it('allows booking when within limits', async () => {
     // Setup tenant with FREE plan
     (prisma.tenant.findUnique as any).mockResolvedValue({
        id: 'tenant-1',
        plan: 'FREE',
      });
  
      // Mock current booking count = 10 (within limit)
      (prisma.booking.count as any).mockResolvedValue(10);
  
      const result = await checkPlanLimit('tenant-1', 'bookings');
      expect(result.allowed).toBe(true);
  });

  it('createBooking calls prisma create', async () => {
    const mockBooking = { id: 'booking-1', status: 'PENDING' };
    (prisma.booking.create as any).mockResolvedValue(mockBooking);

    const input = {
      tenantId: 'tenant-1',
      tourId: 'tour-1',
      customerId: 'cust-1',
      status: 'PENDING',
      totalPrice: 100,
      adultGuests: 2,
      childGuests: 0,
      bookingDate: new Date(),
    } as any;

    const booking = await createBooking(input);
    expect(booking).toEqual(mockBooking);
    expect(prisma.booking.create).toHaveBeenCalled();
  });
});
