import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/currency';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1000, 'USD', 'en-US')).toBe('$1,000');
  });

  it('formats EUR correctly', () => {
    // Note: The output format depends on the locale and implementation details (e.g. non-breaking space)
    // We use a regex or flexible matcher if exact string matching is tricky due to locale implementation differences in Node/JSDOM
    const result = formatCurrency(1000, 'EUR', 'de-DE');
    expect(result).toMatch(/1\.000\s?€/);
  });

  it('formats JPY correctly (no decimals)', () => {
    expect(formatCurrency(1000, 'JPY', 'ja-JP')).toBe('￥1,000');
  });

  it('handles zero', () => {
    expect(formatCurrency(0, 'USD', 'en-US')).toBe('$0');
  });

  it('handles negative numbers', () => {
    expect(formatCurrency(-500, 'USD', 'en-US')).toBe('-$500');
  });

  it('handles large numbers', () => {
    expect(formatCurrency(1000000, 'USD', 'en-US')).toBe('$1,000,000');
  });
});
