import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTours } from '@/lib/db/queries/tours';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    tour: {
      findMany: vi.fn(),
    },
  },
}));

describe('Auth Integration (Multi-tenancy)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTours is scoped to tenantId', async () => {
    await getTours('tenant-123');
    
    expect(prisma.tour.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tenantId: 'tenant-123' },
      })
    );
  });
});
