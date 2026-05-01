import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Menu as MenuIcon, X } from 'lucide-react';
import { Theme } from '../../models/types';
import { Logo } from './Logo';

export const Navbar = ({ theme, toggleTheme, onHomeClick, isBookingPage }: { theme: Theme, toggleTheme: () => void, onHomeClick?: () => void, isBookingPage?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = theme === 'day' ? 'text-stone-900' : 'text-white';
  const bgColor = theme === 'day' ? 'bg-stone-50/90' : 'bg-stone-950/90';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? `${bgColor} backdrop-blur-md shadow-md py-2` : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <button onClick={onHomeClick} className={`flex items-center gap-3 ${textColor} text-left`}>
          <Logo />
          <div className="flex flex-col items-start gap-1">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">057 Cafè</span>
            {isBookingPage ? (
              <span className={`text-[9px] font-bold tracking-[0.25em] ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'} uppercase leading-none`}>Reservations</span>
            ) : (
              <span className="text-[9px] font-bold tracking-[0.25em] text-amber-600 uppercase leading-none">Grill & Lounge</span>
            )}
          </div>
        </button>

        {!isBookingPage && (
          <div className={`hidden md:flex items-center gap-8 ${textColor} font-medium text-[10px] uppercase tracking-widest`}>
            <a href="#about" className="hover:text-amber-600 transition-colors">About</a>
            <a href="#menu" className="hover:text-amber-600 transition-colors">Menu</a>
            <a href="#events" className="hover:text-amber-600 transition-colors">Events</a>
            <a href="#contact" className="hover:text-amber-600 transition-colors">Contact</a>
            
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${theme === 'day' ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-stone-800 text-amber-400 hover:bg-stone-700'}`}
              title={`Switch to ${theme === 'day' ? 'Night' : 'Day'} Mode`}
            >
              {theme === 'day' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        )}

        {isBookingPage && (
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${theme === 'day' ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-stone-800 text-amber-400 hover:bg-stone-700'}`}
            >
              {theme === 'day' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              onClick={onHomeClick}
              className={`py-2 px-6 rounded-full font-bold text-[10px] uppercase tracking-widest border transition-all ${theme === 'day' ? 'border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white' : 'border-white text-white hover:bg-white hover:text-black'}`}
            >
              Back to Home
            </button>
          </div>
        )}

        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className={`${textColor}`}>
            {theme === 'day' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          {!isBookingPage && (
            <button onClick={() => setMobileMenuOpen(true)} className={`${textColor}`}>
              <MenuIcon size={24} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[55] bg-black/10"
            />
            <motion.div 
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 inset-x-0 z-[60] rounded-b-3xl ${theme === 'day' ? 'bg-stone-50/80 hover:bg-stone-50/90' : 'bg-stone-950/80 hover:bg-stone-950/90'} backdrop-blur-xl shadow-2xl flex flex-col p-6`}
            >
              <div className="flex justify-between items-center">
                <Logo />
                <button onClick={() => setMobileMenuOpen(false)} className={textColor}>
                  <X size={28} />
                </button>
              </div>
              <div className={`mt-6 mb-4 flex flex-col gap-6 text-lg font-medium ${textColor}`}>
                <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
                <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Menu</a>
                <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
