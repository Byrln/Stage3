import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTours, createTour } from '@/lib/db/queries/tours';
import { prisma } from '@/lib/prisma';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    tour: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('Tour Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTours returns tours for a tenant', async () => {
    const mockTours = [{ id: '1', title: 'Tour 1', tenantId: 'tenant-1' }];
    (prisma.tour.findMany as any).mockResolvedValue(mockTours);

    const tours = await getTours('tenant-1');
    expect(tours).toEqual(mockTours);
    expect(prisma.tour.findMany).toHaveBeenCalledWith({
      where: { tenantId: 'tenant-1' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('createTour creates a new tour', async () => {
    const mockTour = { id: '1', title: 'New Tour', tenantId: 'tenant-1' };
    (prisma.tour.create as any).mockResolvedValue(mockTour);

    const input = {
      title: 'New Tour',
      tenantId: 'tenant-1',
      slug: 'new-tour',
      shortDescription: 'Desc',
      description: 'Full desc',
      price: 100,
      duration: 3,
      difficulty: 'EASY',
      maxGroupSize: 10,
      imageUrls: [],
    } as any;

    const tour = await createTour(input);
    expect(tour).toEqual(mockTour);
    expect(prisma.tour.create).toHaveBeenCalled();
  });
});
