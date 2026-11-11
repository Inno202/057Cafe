import { describe, expect, it } from 'vitest';
import { validateBooking, VENUE_HIRE_OPTION, type BookingInput } from '../src/bookings/validate';
import { pathFor, redirectTarget, routeFromPath } from '../src/router';

const TODAY = '2026-11-11';
const good: BookingInput = {
  type: 'private_event', name: 'Thabo Mokoena', phone: '072 223 0708', date: '2026-12-01', time: '18:30',
  guests: '4 People', details: 'Birthday', event: '',
};

describe('validateBooking', () => {
  it('accepts a complete request', () => {
    expect(validateBooking(good, TODAY).errors).toEqual({});
  });

  it('requires name, phone, date, time and guests', () => {
    const { errors } = validateBooking({ ...good, name: ' ', phone: '', date: '', time: '', guests: '' }, TODAY);
    expect(Object.keys(errors).sort()).toEqual(['date', 'guests', 'name', 'phone', 'time']);
  });

  it.each(['12345', 'phone me', '+27 72 223 0708 ext 1234567', '<script>'])('rejects the phone number %s', (phone) => {
    expect(validateBooking({ ...good, phone }, TODAY).errors.phone).toBeDefined();
  });

  it('rejects past dates and accepts today', () => {
    expect(validateBooking({ ...good, date: '2026-11-10' }, TODAY).errors.date).toBeDefined();
    expect(validateBooking({ ...good, date: TODAY }, TODAY).errors.date).toBeUndefined();
  });

  it('only offers venue hire for private events', () => {
    expect(validateBooking({ ...good, guests: VENUE_HIRE_OPTION }, TODAY).errors.guests).toBeUndefined();
    const table = { ...good, type: 'weekend_table' as const, guests: VENUE_HIRE_OPTION, event: 'Cocktail Thursday' };
    expect(validateBooking(table, TODAY).errors.guests).toBeDefined();
  });

  it('requires an event for a weekend table and drops unrelated fields', () => {
    const table = { ...good, type: 'weekend_table' as const };
    expect(validateBooking(table, TODAY).errors.event).toBeDefined();
    const { value, errors } = validateBooking({ ...table, event: 'Mimosa Weekend' }, TODAY);
    expect(errors).toEqual({});
    expect(value.details).toBe('');
    expect(validateBooking({ ...good, event: 'x' }, TODAY).value.event).toBe('');
  });

  it('limits the length of details', () => {
    expect(validateBooking({ ...good, details: 'x'.repeat(1001) }, TODAY).errors.details).toBeDefined();
  });
});

describe('router', () => {
  it('maps paths to pages and back', () => {
    expect(routeFromPath('/057Cafe/', '/057Cafe')).toBe('home');
    expect(routeFromPath('/057Cafe/admin', '/057Cafe')).toBe('admin');
    expect(routeFromPath('/057Cafe/privacy/', '/057Cafe')).toBe('privacy');
    expect(routeFromPath('/057Cafe/nope', '/057Cafe')).toBe('home');
    expect(pathFor('booking', '/057Cafe')).toBe('/057Cafe/booking');
    expect(pathFor('home', '/057Cafe')).toBe('/057Cafe/');
  });

  it('only follows same-site redirect targets', () => {
    expect(redirectTarget('?redirect=%2Fadmin')).toBe('/admin');
    expect(redirectTarget('?redirect=https%3A%2F%2Fevil.example')).toBeNull();
    expect(redirectTarget('?redirect=%2F%2Fevil.example')).toBeNull();
    expect(redirectTarget('?redirect=javascript%3Aalert(1)')).toBeNull();
    expect(redirectTarget('')).toBeNull();
  });
});
