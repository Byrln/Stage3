import { describe, it, expect } from 'vitest';
import { hasPermission, getPermissionsForRole } from '@/lib/auth/permissions';

describe('Permissions', () => {
  it('SUPERADMIN has all permissions', () => {
    const permissions = getPermissionsForRole('SUPERADMIN');
    expect(permissions).toContain('manage:tenants');
    expect(permissions).toContain('manage:tours');
  });

  it('ADMIN cannot manage tenants', () => {
    // @ts-ignore - Testing negative case for permission not in type
    expect(hasPermission('ADMIN', 'manage:tenants')).toBe(false);
  });

  it('ADMIN can manage tours', () => {
    expect(hasPermission('ADMIN', 'manage:tours')).toBe(true);
  });

  it('SALES can manage bookings but not tours', () => {
    expect(hasPermission('SALES', 'manage:bookings')).toBe(true);
    // @ts-ignore
    expect(hasPermission('SALES', 'manage:tours')).toBe(false);
  });

  it('USER has limited permissions', () => {
    const permissions = getPermissionsForRole('USER');
    expect(permissions).toContain('view:bookings');
    expect(permissions.length).toBeGreaterThan(0);
  });
});
