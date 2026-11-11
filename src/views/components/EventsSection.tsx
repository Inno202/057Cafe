import { Clock, Download } from 'lucide-react';
import { useContent } from '../../content/ContentProvider';
import { pathFor } from '../../router';

export const EventsSection = ({ onBookClick }: { onBookClick: (event: React.MouseEvent) => void }) => {
  const { events } = useContent();

  return (
    <section id="events" className="section">
      <div className="wrap">
        <h2 className="section-title">{events.title}</h2>

        {events.items.length > 0 && (
          <ul className="mt-10 border-t border-line">
            {events.items.map((event) => (
              <li key={event.id} className="grid gap-x-8 gap-y-3 border-b border-line py-7 md:grid-cols-[12rem_1fr_auto] md:items-center">
                <p className="text-sm font-semibold text-accent md:text-base">{event.day}</p>
                <div>
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="mt-1 flex items-center gap-2 text-[0.9375rem] font-medium tabular-nums">
                    <Clock size={16} aria-hidden="true" className="text-muted" /> {event.time}
                  </p>
                  {event.description && <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">{event.description}</p>}
                </div>
                <a href={pathFor('booking')} onClick={onBookClick} className="btn btn-secondary btn-sm justify-self-start" aria-label={`RSVP now for ${event.title}`}>
                  RSVP Now
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-16 max-w-2xl">
          <h3 className="text-2xl font-black tracking-tight md:text-3xl">{events.hireHeading}</h3>
          <p className="mt-4 leading-relaxed text-muted">{events.hireText}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={pathFor('booking')} onClick={onBookClick} className="btn btn-primary">
              Inquire About Venue Hire
            </a>
            {events.brochureUrl && (
              <a href={events.brochureUrl} target="_blank" rel="noopener noreferrer" className="link link-tap">
                <Download size={18} aria-hidden="true" /> Download Event Brochure
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
