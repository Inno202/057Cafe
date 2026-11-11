import { useEffect, useState } from 'react';
import type { QueryDocumentSnapshot } from 'firebase/firestore/lite';
import { Trash2 } from 'lucide-react';
import { BOOKING_RETENTION_DAYS, BOOKING_STATUSES, type BookingStatus } from '../bookings/validate';
import { can, type Role } from './roles';
import { deleteBooking, errorMessage, fetchBookings, setBookingStatus, type Booking } from './store';

const STATUS_LABELS: Record<BookingStatus, string> = { new: 'New', confirmed: 'Confirmed', declined: 'Declined', done: 'Done' };
const TYPE_LABELS = { private_event: 'Private event', weekend_table: 'Weekend table' } as const;

export function BookingsPanel({ role }: { role: Role }) {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot | null>(null);
  const [onlyNew, setOnlyNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const load = async (after: QueryDocumentSnapshot | null) => {
    setBusy(true);
    setMessage('');
    try {
      const page = await fetchBookings(after);
      setBookings((current) => (after && current ? [...current, ...page.bookings] : page.bookings));
      setCursor(page.cursor);
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { void load(null); }, []);

  const changeStatus = async (booking: Booking, status: BookingStatus) => {
    const previous = booking.status;
    setBookings((list) => list?.map((item) => (item.id === booking.id ? { ...item, status } : item)) ?? null);
    try {
      await setBookingStatus(booking.id, status);
      setMessage(`${booking.name}: marked ${STATUS_LABELS[status].toLowerCase()}.`);
    } catch (error) {
      setBookings((list) => list?.map((item) => (item.id === booking.id ? { ...item, status: previous } : item)) ?? null);
      setMessage(errorMessage(error));
    }
  };

  const remove = async (booking: Booking) => {
    if (!window.confirm(`Delete the booking request from ${booking.name}? This cannot be undone.`)) return;
    try {
      await deleteBooking(booking.id);
      setBookings((list) => list?.filter((item) => item.id !== booking.id) ?? null);
      setMessage(`Deleted the request from ${booking.name}.`);
    } catch (error) {
      setMessage(errorMessage(error));
    }
  };

  const shown = bookings?.filter((booking) => !onlyNew || booking.status === 'new') ?? [];

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight">Booking requests</h2>
      <p className="mt-1 text-muted">
        Requests sent from the booking page, newest first. They are deleted automatically after {BOOKING_RETENTION_DAYS} days.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="flex min-h-11 cursor-pointer items-center gap-2">
          <input type="checkbox" className="size-5 accent-amber-700" checked={onlyNew} onChange={(event) => setOnlyNew(event.target.checked)} />
          Show new requests only
        </label>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => void load(null)} disabled={busy}>Refresh</button>
        <p role="status" aria-live="polite" className="text-sm text-muted">{message}</p>
      </div>

      {bookings === null ? (
        <p className="mt-8 text-muted">{busy ? 'Loading…' : ''}</p>
      ) : shown.length === 0 ? (
        <p className="mt-8 text-muted">
          {bookings.length === 0 ? 'No booking requests yet. They will appear here as soon as a customer sends one.' : 'No new requests. Untick the filter to see handled ones.'}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {shown.map((booking) => (
            <li key={booking.id} className="grid gap-x-8 gap-y-3 py-5 md:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <p className="text-lg font-bold break-words">{booking.name}</p>
                <p><a href={`tel:${booking.phone}`} className="link link-tap tabular-nums">{booking.phone}</a></p>
                <p className="tabular-nums">
                  {TYPE_LABELS[booking.type] ?? booking.type} · {booking.date} at {booking.time} · {booking.guests}
                </p>
                {booking.event && <p className="text-muted">Event: {booking.event}</p>}
                {booking.details && <p className="mt-1 break-words whitespace-pre-wrap text-muted">{booking.details}</p>}
                <p className="mt-1 text-sm text-muted">
                  Received {booking.createdAt ? booking.createdAt.toLocaleString() : 'just now'}
                  {booking.handledBy ? ` · last updated by ${booking.handledBy}` : ''}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <label className="sr-only" htmlFor={`status-${booking.id}`}>Status of the request from {booking.name}</label>
                <select
                  id={`status-${booking.id}`}
                  className="field w-40"
                  value={booking.status}
                  onChange={(event) => void changeStatus(booking, event.target.value as BookingStatus)}
                >
                  {BOOKING_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
                </select>
                {can(role, 'deleteBookings') && (
                  <button type="button" className="icon-btn text-danger" onClick={() => void remove(booking)} aria-label={`Delete the request from ${booking.name}`}>
                    <Trash2 size={20} aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {cursor && (
        <button type="button" className="btn btn-secondary mt-6" onClick={() => void load(cursor)} disabled={busy}>
          {busy ? 'Loading…' : 'Load older requests'}
        </button>
      )}
    </div>
  );
}
