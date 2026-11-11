import { cleanText } from '../content/validate';

export const BOOKING_TYPES = ['private_event', 'weekend_table'] as const;
export type BookingType = (typeof BOOKING_TYPES)[number];

export const GUEST_OPTIONS = ['2 People', '4 People', '6-10 People'] as const;
export const VENUE_HIRE_OPTION = 'Private Venue Hire (20+)';

/** Booking requests are deleted this many days after they are sent. */
export const BOOKING_RETENTION_DAYS = 365;

export const BOOKING_STATUSES = ['new', 'confirmed', 'declined', 'done'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface BookingInput {
  type: BookingType;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  details: string;
  event: string;
}

export type BookingErrors = Partial<Record<keyof BookingInput, string>>;

export const todayIso = (now = new Date()) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

/**
 * Checks a booking request before it is sent. firestore.rules repeats the
 * same limits on the server, so a tampered page cannot store anything else.
 */
export function validateBooking(raw: BookingInput, today = todayIso()): { value: BookingInput; errors: BookingErrors } {
  const errors: BookingErrors = {};
  const value: BookingInput = {
    type: BOOKING_TYPES.includes(raw.type) ? raw.type : 'private_event',
    name: cleanText(raw.name ?? ''),
    phone: cleanText(raw.phone ?? ''),
    date: (raw.date ?? '').trim(),
    time: (raw.time ?? '').trim(),
    guests: cleanText(raw.guests ?? ''),
    details: cleanText(raw.details ?? ''),
    event: cleanText(raw.event ?? ''),
  };

  if (value.name.length < 2) errors.name = 'Enter your full name.';
  else if (value.name.length > 80) errors.name = 'Name is too long (80 characters at most).';

  const digits = value.phone.replace(/\D/g, '');
  if (!/^[0-9+ ()-]{7,20}$/.test(value.phone) || digits.length < 9 || digits.length > 15) {
    errors.phone = 'Enter a phone number we can reach you on, for example 082 123 4567.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.date) || Number.isNaN(Date.parse(value.date))) errors.date = 'Choose a date.';
  else if (value.date < today) errors.date = 'Choose today or a later date.';

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value.time)) errors.time = 'Choose an arrival time.';

  const allowedGuests: string[] = value.type === 'private_event' ? [...GUEST_OPTIONS, VENUE_HIRE_OPTION] : [...GUEST_OPTIONS];
  if (!allowedGuests.includes(value.guests)) errors.guests = 'Choose a guest count.';

  if (value.details.length > 1000) errors.details = 'Keep the details under 1000 characters.';

  if (value.type === 'weekend_table') {
    value.details = '';
    if (!value.event) errors.event = 'Choose an event.';
    else if (value.event.length > 80) errors.event = 'Event name is too long.';
  } else {
    value.event = '';
  }

  return { value, errors };
}
