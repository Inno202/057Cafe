import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useContent } from '../../content/ContentProvider';
import { SocialLinks } from './SocialLinks';

export const ContactSection = () => {
  const { site } = useContent();
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="contact" className="section bg-surface">
      <div className="wrap">
        <h2 className="section-title">{site.contactTitle}</h2>

        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
          <dl className="space-y-8">
            <div>
              <dt className="text-lg font-bold">Location</dt>
              <dd className="mt-2 leading-relaxed text-muted">
                {site.street}
                <br />
                {site.city}, {site.postalCode}
              </dd>
              <dd>
                <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="link link-tap">
                  Get Directions
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-lg font-bold">Direct Call</dt>
              <dd>
                <a href={`tel:${site.phone}`} className="link-tap text-lg font-semibold tabular-nums hover:text-accent">{site.phoneDisplay}</a>
              </dd>
              <dd>
                <a href={`mailto:${site.email}`} className="link-tap break-all text-muted hover:text-accent">{site.email}</a>
              </dd>
            </div>
            {site.hours.length > 0 && (
              <div>
                <dt className="text-lg font-bold">Trading Hours</dt>
                <dd className="mt-2">
                  <table className="text-muted tabular-nums">
                    <tbody>
                      {site.hours.map((row) => (
                        <tr key={row.id}>
                          <th scope="row" className="py-1 pr-6 text-left font-semibold text-ink">{row.label}</th>
                          <td className="py-1">{row.opens} - {row.closes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </dd>
              </div>
            )}
          </dl>

          <div>
            {site.mapEmbedUrl && (
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-page">
                {showMap ? (
                  <iframe
                    src={site.mapEmbedUrl}
                    title={`Map showing ${site.fullName}`}
                    className="size-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
                    <MapPin size={32} aria-hidden="true" className="text-accent" />
                    <p className="font-semibold">{site.street}, {site.city}</p>
                    <button type="button" onClick={() => setShowMap(true)} className="btn btn-secondary btn-sm">
                      Show map
                    </button>
                    <p className="max-w-xs text-sm text-muted">The map is loaded from Google Maps, which may set cookies.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {(site.facebookUrl || site.instagramUrl) && (
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
            <div>
              {site.socialHeading && <h3 className="text-xl font-bold">{site.socialHeading}</h3>}
              {site.socialText && <p className="mt-1 text-muted">{site.socialText}</p>}
            </div>
            <SocialLinks />
          </div>
        )}
      </div>
    </section>
  );
};
