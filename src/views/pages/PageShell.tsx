import type { ReactNode } from 'react';
import type { Theme } from '../../content/types';
import type { Route } from '../../router';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export interface PageProps {
  theme: Theme;
  toggleTheme: () => void;
  navigate: (route: Route, hash?: string) => void;
}

/** Frame shared by every public page: skip link, header, main landmark, footer. */
export const PageShell = ({ theme, toggleTheme, navigate, page, label, children }:
  PageProps & { page: 'home' | 'inner'; label?: string; children: ReactNode }) => (
  <div data-theme={theme} className="min-h-svh bg-page text-ink transition-colors duration-200">
    <a href="#main" className="skip-link">Skip to content</a>
    <Navbar theme={theme} toggleTheme={toggleTheme} navigate={navigate} page={page} label={label} />
    <main id="main">{children}</main>
    <Footer navigate={navigate} />
  </div>
);
