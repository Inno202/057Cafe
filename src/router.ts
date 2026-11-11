import { useCallback, useEffect, useState } from 'react';

export const ROUTES = ['home', 'booking', 'admin', 'privacy', 'terms', 'cookies'] as const;
export type Route = (typeof ROUTES)[number];

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function routeFromPath(pathname: string, base = BASE): Route {
  const rest = (pathname.startsWith(base) ? pathname.slice(base.length) : pathname).replace(/^\/+|\/+$/g, '');
  const first = rest.split('/')[0];
  return (ROUTES as readonly string[]).includes(first) && first !== 'home' ? (first as Route) : 'home';
}

export const pathFor = (route: Route, base = BASE) => (route === 'home' ? `${base}/` : `${base}/${route}`);

/**
 * GitHub Pages serves 404.html for deep links, which sends the visitor to
 * /?redirect=<path>. Only same-site paths are accepted, never a full URL.
 */
export function redirectTarget(search: string): string | null {
  const target = new URLSearchParams(search).get('redirect');
  if (!target || !/^\/[A-Za-z0-9/_-]*$/.test(target) || target.startsWith('//')) return null;
  return target;
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => {
    const target = redirectTarget(window.location.search);
    if (target) {
      const restored = routeFromPath(target, '');
      window.history.replaceState(null, '', pathFor(restored));
      return restored;
    }
    return routeFromPath(window.location.pathname);
  });

  useEffect(() => {
    const onPop = () => setRoute(routeFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((next: Route, hash = '') => {
    window.history.pushState(null, '', pathFor(next) + hash);
    setRoute(next);
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, []);

  return { route, navigate };
}
