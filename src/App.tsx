import { lazy, Suspense, useEffect, useState } from 'react';
import { useContent } from './content/ContentProvider';
import type { Theme } from './content/types';
import { useRoute } from './router';
import { businessJsonLd, jsonForScript } from './seo';
import { BookingPage } from './views/pages/BookingPage';
import { HomePage } from './views/pages/HomePage';
import { CookiesPage, PrivacyPage, TermsPage } from './views/pages/LegalPages';

// The admin area (and Firebase sign-in) is only downloaded when someone opens /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  const [theme, setTheme] = useState<Theme>('day');
  const { route, navigate } = useRoute();
  const content = useContent();

  // Keep search-engine data in step with the content store.
  useEffect(() => {
    const script = document.getElementById('business-data');
    if (script) script.textContent = jsonForScript(businessJsonLd(content));
  }, [content]);

  const props = { theme, toggleTheme: () => setTheme((current) => (current === 'day' ? 'night' : 'day')), navigate };

  switch (route) {
    case 'admin':
      return (
        <Suspense fallback={<p className="p-8 text-muted">Loading…</p>}>
          <AdminApp navigate={navigate} />
        </Suspense>
      );
    case 'booking': return <BookingPage {...props} />;
    case 'privacy': return <PrivacyPage {...props} />;
    case 'terms': return <TermsPage {...props} />;
    case 'cookies': return <CookiesPage {...props} />;
    default: return <HomePage {...props} />;
  }
}
