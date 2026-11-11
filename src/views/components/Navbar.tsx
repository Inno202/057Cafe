import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Menu as MenuIcon, Moon, Sun, X } from 'lucide-react';
import { useContent } from '../../content/ContentProvider';
import type { Theme } from '../../content/types';
import { pathFor, type Route } from '../../router';
import { Logo } from './Logo';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'menu', label: 'Menu' },
  { id: 'events', label: 'Events' },
  { id: 'contact', label: 'Contact' },
];

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  navigate: (route: Route, hash?: string) => void;
  /** 'home' sits over the banner photo; other pages show a sub-label and a way back. */
  page: 'home' | 'inner';
  label?: string;
}

export const Navbar = ({ theme, toggleTheme, navigate, page, label }: NavbarProps) => {
  const { site } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open || page === 'inner';
  const themeLabel = `Switch to ${theme === 'day' ? 'night' : 'day'} mode`;
  const goHome = (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(false);
    navigate('home');
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-200 ${
        solid ? 'bg-page text-ink shadow-[0_1px_0_var(--line)]' : 'text-white'
      }`}
    >
      <div className="wrap flex h-18 items-center justify-between gap-4">
        <a href={pathFor('home')} onClick={goHome} className="flex min-h-11 items-center gap-3">
          <Logo />
          <span className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight uppercase">{site.name}</span>
            <span className={`mt-1 text-sm font-medium ${solid ? 'text-accent' : 'text-white/85'}`}>{label ?? site.tagline}</span>
          </span>
        </a>

        <nav aria-label="Main" className="flex items-center gap-1">
          {page === 'home' && (
            <ul className="mr-2 hidden items-center md:flex">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="nav-link inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-medium">
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {page === 'inner' && (
            <a href={pathFor('home')} onClick={goHome} className="btn btn-secondary btn-sm mr-1 hidden sm:inline-flex">
              <ArrowLeft size={18} aria-hidden="true" /> Back to Home
            </a>
          )}
          <button type="button" onClick={toggleTheme} className="icon-btn" aria-label={themeLabel} title={themeLabel}>
            {theme === 'day' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
          </button>
          {page === 'home' && (
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="icon-btn md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={24} aria-hidden="true" /> : <MenuIcon size={24} aria-hidden="true" />}
            </button>
          )}
        </nav>
      </div>

      {page === 'home' && open && (
        <div id="mobile-menu" className="mobile-menu border-t border-line bg-page md:hidden">
          <ul className="wrap flex flex-col py-2">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} onClick={() => setOpen(false)} className="flex min-h-13 items-center text-lg font-medium">
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};
