import { useState } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import { useContent } from '../../content/ContentProvider';
import { Emphasis } from '../../content/emphasis';
import { CATEGORY_LABELS } from '../../content/schema';
import { MENU_CATEGORIES, type MenuCategory } from '../../content/types';

type Filter = 'all' | MenuCategory;

export const MenuSection = () => {
  const { menu } = useContent();
  const [filter, setFilter] = useState<Filter>('all');

  // Only offer categories that have something in them.
  const categories = MENU_CATEGORIES.filter((category) => menu.items.some((item) => item.category === category));
  const active: Filter = filter !== 'all' && !categories.includes(filter) ? 'all' : filter;
  const items = active === 'all' ? menu.items : menu.items.filter((item) => item.category === active);

  return (
    <section id="menu" className="section bg-surface">
      <div className="wrap">
        <h2 className="section-title">{menu.title}</h2>

        {categories.length > 1 && (
          <div role="group" aria-label="Filter the menu" className="mt-8 flex flex-wrap gap-2">
            {(['all', ...categories] as Filter[]).map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={active === category}
                onClick={() => setFilter(category)}
                className={`btn btn-sm ${active === category ? 'btn-primary' : 'btn-secondary'}`}
              >
                {category === 'all' ? 'All' : CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <div className="mt-12 max-w-md">
            <h3 className="text-lg font-bold">Ooops</h3>
            <p className="mt-1 text-muted">Too popular to stay in the kitchen. Try again tomorrow!</p>
          </div>
        ) : (
          <ul key={active} className="fade-in mt-10 grid gap-x-16 md:grid-cols-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-6 border-b border-line py-5">
                <div>
                  <h3 className="text-base font-semibold">
                    {item.name}
                    {item.category === 'african' && <span className="ml-2 text-sm font-medium text-accent">Native</span>}
                  </h3>
                  {item.description && <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{item.description}</p>}
                </div>
                <span className="shrink-0 text-lg font-bold whitespace-nowrap text-accent tabular-nums">{item.price}</span>
              </li>
            ))}
          </ul>
        )}

        {menu.barNote && (active === 'all' || active === 'drinks') && (
          <p className="mt-8 max-w-3xl text-[0.9375rem] leading-relaxed text-muted">
            <Emphasis text={menu.barNote} as="strong" />
          </p>
        )}

        {menu.pdfUrl && (
          <a href={menu.pdfUrl} target="_blank" rel="noopener noreferrer" className="link link-tap mt-6">
            <Download size={18} aria-hidden="true" /> Download PDF Menu
          </a>
        )}

        <div className="mt-16 grid items-center gap-8 border-t border-line pt-16 md:grid-cols-[2fr_3fr] md:gap-14">
          <img
            src={menu.featureImage}
            alt={menu.featureImageAlt}
            width={800}
            height={600}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
          <div>
            <h3 className="text-2xl font-black tracking-tight md:text-3xl">{menu.featureHeading}</h3>
            <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">{menu.featureText}</p>
            {menu.featureLinkUrl && menu.featureLinkLabel && (
              <a href={menu.featureLinkUrl} target="_blank" rel="noopener noreferrer" className="link link-tap mt-4">
                {menu.featureLinkLabel} <ChevronRight size={18} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
