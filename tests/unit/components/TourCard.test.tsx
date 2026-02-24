import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TourCard } from '@/components/public/tour-card';
import type { Tour } from '@prisma/client';
import React from 'react';

// Mock next-intl
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock currency context
vi.mock('@/components/public/currency-context', () => ({
  useCurrency: () => ({ currency: 'USD' }),
}));

// Mock formatCurrency
vi.mock('@/lib/currency', () => ({
  formatCurrency: (amount: number) => `$${amount}`,
}));

const mockTour: Tour = {
  id: '1',
  slug: 'test-tour',
  title: 'Test Tour',
  shortDescription: 'A great tour',
  description: 'Detailed description',
  price: 100,
  duration: 5,
  difficulty: 'EASY',
  maxGroupSize: 10,
  included: [],
  excluded: [],
  itinerary: [],
  imageUrls: ['/test.jpg'],
  featured: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  tenantId: 'tenant-1',
  rating: 4.5,
  reviewCount: 10,
  startDates: [],
  galleryUrls: [],
  metaTitle: null,
  metaDescription: null,
  requirements: [],
  minAge: null,
};

describe('TourCard', () => {
  it('renders correctly with required props', () => {
    render(<TourCard tour={mockTour} />);
    
    expect(screen.getByText('Test Tour')).toBeDefined();
    expect(screen.getByText('A great tour')).toBeDefined();
    expect(screen.getByText('$100')).toBeDefined();
    expect(screen.getByText(/5\s*days/)).toBeDefined(); 
  });

  it('renders price correctly', () => {
    render(<TourCard tour={mockTour} />);
    expect(screen.getByText('$100')).toBeDefined();
  });
  
  it('renders difficulty correctly', () => {
     render(<TourCard tour={mockTour} />);
     expect(screen.getByText('easy')).toBeDefined();
  });
});
