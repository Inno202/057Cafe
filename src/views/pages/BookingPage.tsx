import { useId, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  GUEST_OPTIONS, VENUE_HIRE_OPTION, todayIso, validateBooking,
  type BookingErrors, type BookingInput, type BookingType,
} from '../../bookings/validate';
import { useContent } from '../../content/ContentProvider';
import { Emphasis } from '../../content/emphasis';
import { pathFor } from '../../router';
import { PageShell, type PageProps } from './PageShell';

const EMPTY: BookingInput = {
  type: 'private_event', name: '', phone: '', date: '', time: '', guests: GUEST_OPTIONS[0], details: '', event: '',
};

const TYPES: { value: BookingType; label: string }[] = [
  { value: 'private_event', label: 'Private Event' },
  { value: 'weekend_table', label: 'Weekend Table' },
];

export const BookingPage = (props: PageProps) => {
  const { booking, events, site } = useContent();
  const [form, setForm] = useState<BookingInput>(EMPTY);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [trap, setTrap] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const set = <K extends keyof BookingInput>(key: K, value: BookingInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const setType = (type: BookingType) => {
    setForm((current) => ({
      ...current,
      type,
      guests: type === 'weekend_table' && current.guests === VENUE_HIRE_OPTION ? GUEST_OPTIONS[0] : current.guests,
    }));
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === 'sending') return;
    const result = validateBooking(form);
    setErrors(result.errors);
    const firstError = Object.keys(result.errors)[0];
    if (firstError) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }
    setState('sending');
    try {
      // A filled-in hidden field means a bot: accept quietly, store nothing.
      if (!trap) await (await import('../../firebase/bookings')).submitBooking(result.value);
      setState('sent');
      setForm(EMPTY);
    } catch {
      setState('failed');
    }
  };

  const describe = (name: keyof BookingInput) => ({
    name,
    id: id(name),
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? id(`${name}-error`) : undefined,
  });
  const error = (name: keyof BookingInput) =>
    errors[name] && <p id={id(`${name}-error`)} className="field-error">{errors[name]}</p>;

  const home = (event: React.MouseEvent) => {
    event.preventDefault();
    props.navigate('home');
  };

  return (
    <PageShell {...props} page="inner" label="Reservations">
      <div className="wrap max-w-2xl pt-28 pb-20">
        <a href={pathFor('home')} onClick={home} className="link-tap text-muted hover:text-accent sm:hidden">
          <ArrowLeft size={18} aria-hidden="true" /> Back to Home
        </a>

        <h1 className="section-title mt-4"><Emphasis text={booking.heading} /></h1>
        {booking.intro && <p className="mt-3 text-lg text-muted">{booking.intro}</p>}

        {state === 'sent' ? (
          <div role="status" className="fade-in mt-10 border-t border-line pt-8">
            <h2 className="text-2xl font-black tracking-tight">{booking.successHeading}</h2>
            <p className="mt-3 leading-relaxed text-muted">{booking.successText}</p>
            <button type="button" onClick={() => setState('idle')} className="btn btn-secondary mt-6">
              Submit another request
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
            <div role="radiogroup" aria-label="Booking type" className="grid grid-cols-2 gap-1 rounded-full border border-line bg-surface p-1">
              {TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  role="radio"
                  aria-checked={form.type === type.value}
                  onClick={() => setType(type.value)}
                  className={`btn btn-sm ${form.type === type.value ? 'btn-primary' : 'text-muted hover:text-ink'}`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={id('name')} className="field-label">Full Name</label>
                <input {...describe('name')} type="text" autoComplete="name" maxLength={80} required className="field" value={form.name} onChange={(e) => set('name', e.target.value)} />
                {error('name')}
              </div>
              <div>
                <label htmlFor={id('phone')} className="field-label">Phone Number</label>
                <input {...describe('phone')} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} required className="field" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                {error('phone')}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor={id('date')} className="field-label">Event Date</label>
                <input {...describe('date')} type="date" min={todayIso()} required className="field" value={form.date} onChange={(e) => set('date', e.target.value)} />
                {error('date')}
              </div>
              <div>
                <label htmlFor={id('time')} className="field-label">Arrival Time</label>
                <input {...describe('time')} type="time" required className="field" value={form.time} onChange={(e) => set('time', e.target.value)} />
                {error('time')}
              </div>
              <div>
                <label htmlFor={id('guests')} className="field-label">Guest Count</label>
                <select {...describe('guests')} className="field" value={form.guests} onChange={(e) => set('guests', e.target.value)}>
                  {GUEST_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  {form.type === 'private_event' && <option>{VENUE_HIRE_OPTION}</option>}
                </select>
                {error('guests')}
              </div>
            </div>

            {form.type === 'private_event' ? (
              <div>
                <label htmlFor={id('details')} className="field-label">Occasion Details</label>
                <textarea {...describe('details')} rows={4} maxLength={1000} className="field" placeholder="Briefly describe your event (e.g. Birthday Celebration)" value={form.details} onChange={(e) => set('details', e.target.value)} />
                {error('details')}
              </div>
            ) : (
              <div>
                <label htmlFor={id('event')} className="field-label">Select Event</label>
                <select {...describe('event')} required className="field" value={form.event} onChange={(e) => set('event', e.target.value)}>
                  <option value="">Select a weekend event...</option>
                  {events.items.map((item) => (
                    <option key={item.id} value={item.title}>{item.title} ({item.day})</option>
                  ))}
                </select>
                {error('event')}
              </div>
            )}

            {/* Hidden from people; bots that fill every field give themselves away. */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor={id('website')}>Website</label>
              <input id={id('website')} type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>

            <p className="border-t border-line pt-6 text-[0.9375rem] leading-relaxed text-muted">
              <strong className="font-semibold text-ink">Note:</strong>{' '}
              {form.type === 'private_event' ? booking.privateNote : booking.tableNote}
            </p>

            {state === 'failed' && (
              <p role="alert" className="field-error text-base">
                We could not send your request. Check your connection and try again, or call us on{' '}
                <a href={`tel:${site.phone}`} className="underline underline-offset-4">{site.phoneDisplay}</a>.
              </p>
            )}

            <button type="submit" disabled={state === 'sending'} className="btn btn-primary w-full">
              {state === 'sending' ? 'Sending…' : form.type === 'private_event' ? 'Request Reservation' : 'Book Table'}
            </button>

            <p className="text-sm text-muted">
              We use these details only to handle your booking. See our{' '}
              <a href={pathFor('privacy')} onClick={(e) => { e.preventDefault(); props.navigate('privacy'); }} className="link">Privacy Policy</a>.
            </p>
          </form>
        )}
      </div>
    </PageShell>
  );
};
