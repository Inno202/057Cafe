import { describe, expect, it } from 'vitest';
import { can, validateStaff } from '../src/admin/roles';
import { DEFAULT_CONTENT } from '../src/content/defaults';
import { businessJsonLd, jsonForScript } from '../src/seo';

describe('roles', () => {
  it('owner may do everything', () => {
    for (const p of ['content', 'bookings', 'deleteBookings', 'staff'] as const) expect(can('owner', p)).toBe(true);
  });
  it('manager may not manage staff', () => {
    expect(can('manager', 'content')).toBe(true);
    expect(can('manager', 'deleteBookings')).toBe(true);
    expect(can('manager', 'staff')).toBe(false);
  });
  it('host may only handle bookings', () => {
    expect(can('host', 'bookings')).toBe(true);
    expect(can('host', 'content')).toBe(false);
    expect(can('host', 'deleteBookings')).toBe(false);
    expect(can('host', 'staff')).toBe(false);
  });
  it('no role means no access', () => {
    expect(can(null, 'bookings')).toBe(false);
    expect(can(undefined, 'content')).toBe(false);
  });
});

describe('validateStaff', () => {
  it('lower-cases the email and accepts a valid entry', () => {
    const { value, errors } = validateStaff({ email: ' Thabo@057Cafe.co.za ', name: ' Thabo ', role: 'manager' });
    expect(errors).toEqual({});
    expect(value).toEqual({ email: 'thabo@057cafe.co.za', name: 'Thabo', role: 'manager', active: true });
  });
  it('rejects a bad email, empty name and unknown role', () => {
    const { errors } = validateStaff({ email: 'a/b@c', name: '', role: 'admin' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'name', 'role']);
  });
});

describe('search-engine data', () => {
  it('is built from the content', () => {
    const data = businessJsonLd(DEFAULT_CONTENT);
    expect(data.telephone).toBe(DEFAULT_CONTENT.site.phone);
    expect(data.openingHoursSpecification).toHaveLength(3);
    expect(data.openingHoursSpecification[1]).toMatchObject({ dayOfWeek: ['Friday', 'Saturday'], opens: '10:00', closes: '02:00' });
  });
  it('cannot break out of its script tag', () => {
    expect(jsonForScript({ name: '</script><script>alert(1)</script>' })).not.toContain('<');
  });
});
