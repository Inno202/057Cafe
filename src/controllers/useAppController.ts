import { useState } from 'react';
import { Theme } from '../models/types';

export const useAppController = () => {
  const [theme, setTheme] = useState<Theme>('day');
  const [view, setView] = useState<'home' | 'booking'>('home');

  const toggleTheme = () => {
    setTheme((prev: Theme) => prev === 'day' ? 'night' : 'day');
  };

  const navigateToBooking = () => {
    setView('booking');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setView('home');
    window.scrollTo(0, 0);
  };

  return {
    theme,
    view,
    toggleTheme,
    navigateToBooking,
    navigateToHome,
  };
};
