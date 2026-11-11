import { ChevronRight } from 'lucide-react';
import { useContent } from '../../content/ContentProvider';
import { Emphasis } from '../../content/emphasis';
import type { Theme } from '../../content/types';
import { pathFor } from '../../router';

export const Hero = ({ theme, onBookClick }: { theme: Theme; onBookClick: (event: React.MouseEvent) => void }) => {
  const { home } = useContent();
  const hero = theme === 'day' ? home.heroDay : home.heroNight;

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-stone-900 pt-24 pb-16">
      {/* Both photos stay mounted so switching day/night is a cross-fade, not a reload. */}
      {(['day', 'night'] as const).map((mode) => {
        const block = mode === 'day' ? home.heroDay : home.heroNight;
        return (
          <img
            key={mode}
            src={block.image}
            alt={mode === theme ? block.imageAlt : ''}
            aria-hidden={mode !== theme}
            fetchPriority={mode === theme ? 'high' : 'low'}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${mode === theme ? 'opacity-100' : 'opacity-0'}`}
          />
        );
      })}
      <div className={`absolute inset-0 transition-colors duration-500 ${theme === 'day' ? 'bg-stone-950/55' : 'bg-black/70'}`} />

      <div className="wrap relative text-white">
        <div key={theme} className="hero-enter max-w-3xl">
          <h1 className="text-[clamp(2.5rem,9vw,6rem)] leading-[1.02] font-black tracking-[-0.03em] [--accent:var(--color-amber-500)]">
            <Emphasis text={hero.heading} />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-stone-100 md:text-xl">{hero.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#menu" className="btn btn-primary [--accent-fill:var(--color-amber-700)] [--accent-fill-hover:var(--color-amber-800)] [--on-accent:#fff]">
              View Menu <ChevronRight size={18} aria-hidden="true" />
            </a>
            <a href={pathFor('booking')} onClick={onBookClick} className="btn btn-on-photo">
              Book Event
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
