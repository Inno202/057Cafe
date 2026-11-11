import { useContent } from '../../content/ContentProvider';
import { pathFor, type Route } from '../../router';
import { SocialLinks } from './SocialLinks';

const LINKS: { route: Route; label: string }[] = [
  { route: 'privacy', label: 'Privacy' },
  { route: 'terms', label: 'Terms' },
  { route: 'cookies', label: 'Cookies' },
  { route: 'admin', label: 'Staff sign-in' },
];

export const Footer = ({ navigate }: { navigate: (route: Route) => void }) => {
  const { site } = useContent();

  return (
    <footer className="border-t border-line py-12">
      <div className="wrap">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="text-2xl font-black tracking-tight uppercase">{site.name}</p>
            {site.footerBlurb && <p className="mt-2 max-w-sm text-muted">{site.footerBlurb}</p>}
          </div>
          <SocialLinks />
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line pt-6 text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} {site.footerName}. All rights reserved.</p>
          <ul className="-mx-3 flex flex-wrap">
            {LINKS.map((link) => (
              <li key={link.route}>
                <a
                  href={pathFor(link.route)}
                  onClick={(event) => { event.preventDefault(); navigate(link.route); }}
                  className="inline-flex min-h-11 items-center px-3 hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
