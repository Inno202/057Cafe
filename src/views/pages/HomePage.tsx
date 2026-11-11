import { useContent } from '../../content/ContentProvider';
import { Emphasis } from '../../content/emphasis';
import { ContactSection } from '../components/ContactSection';
import { EventsSection } from '../components/EventsSection';
import { GallerySection } from '../components/GallerySection';
import { Hero } from '../components/Hero';
import { MenuSection } from '../components/MenuSection';
import { PageShell, type PageProps } from './PageShell';

export const HomePage = (props: PageProps) => {
  const { home } = useContent();
  const book = (event: React.MouseEvent) => {
    event.preventDefault();
    props.navigate('booking');
  };

  return (
    <PageShell {...props} page="home">
      <Hero theme={props.theme} onBookClick={book} />

      <section id="about" className="section">
        <div className="wrap grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="section-title"><Emphasis text={home.aboutHeading} /></h2>
            <p className="mt-6 leading-relaxed text-muted"><Emphasis text={home.aboutText1} as="strong" /></p>
            {home.aboutText2 && <p className="mt-4 leading-relaxed text-muted"><Emphasis text={home.aboutText2} as="strong" /></p>}
            {home.pillars.length > 0 && (
              <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-6">
                {home.pillars.map((pillar) => (
                  <div key={pillar.id}>
                    <dt className="text-2xl font-black tracking-tight">{pillar.title}</dt>
                    <dd className="mt-1 text-[0.9375rem] font-medium text-accent">{pillar.text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <figure>
            <img
              src={home.aboutImage}
              alt={home.aboutImageAlt}
              width={800}
              height={800}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="aspect-square w-full rounded-2xl object-cover"
            />
            {home.aboutQuote && <figcaption className="mt-4 text-lg font-bold tracking-tight">{home.aboutQuote}</figcaption>}
          </figure>
        </div>
      </section>

      <GallerySection />
      <MenuSection />
      <EventsSection onBookClick={book} />
      <ContactSection />
    </PageShell>
  );
};
