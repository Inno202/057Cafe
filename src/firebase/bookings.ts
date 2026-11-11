import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore/lite';
import { BOOKING_RETENTION_DAYS, type BookingInput } from '../bookings/validate';
import { getDb } from './app';

export const BOOKINGS_COLLECTION = 'bookings';

/** Create-only: the public site can add a booking request but can never read one back. */
export async function submitBooking(booking: BookingInput): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Bookings are not available right now.');
  await addDoc(collection(db, BOOKINGS_COLLECTION), {
    ...booking,
    status: 'new',
    createdAt: serverTimestamp(),
    expireAt: Timestamp.fromMillis(Date.now() + BOOKING_RETENTION_DAYS * 86_400_000),
  });
}
