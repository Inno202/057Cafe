import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Theme } from '../../models/types';

export const Hero = ({ theme, onBookClick }: { theme: Theme, onBookClick?: () => void }) => {
  return (
    <section className="relative min-h-screen sm:h-screen pt-24 sm:pt-0 flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={theme === 'day' 
              ? "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1920&h=1080"
              : "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920&h=1080"
            }
            alt="Cafe Interior"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 ${theme === 'day' ? 'bg-stone-900/40' : 'bg-black/70'}`} />
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-6 w-full text-white z-10">
        <motion.div
           initial={{ y: 30, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.5, duration: 0.8 }}
           className="max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-[1.1] md:leading-tight tracking-tighter">
            {theme === 'day' ? (
              <>AUTHENTIC <span className="text-amber-500">GRILL</span> VIBES.</>
            ) : (
              <>ELITE <span className="text-amber-500">LOUNGE</span> LUXURY.</>
            )}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-stone-200 mb-8 font-light italic">
            {theme === 'day' 
              ? "Experience the authentic taste of Mzansi with our slow-cooked African cuisines and signature grilled meats."
              : "Stateway's premier destination for sophisticated nights, chilled vibes, and premium cocktails."}
          </p>
          <div className="flex flex-row gap-3 sm:gap-4 w-full">
            <a href="#menu" className="bg-amber-600 hover:bg-amber-700 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all flex-1 sm:flex-none text-sm sm:text-base">
              View Menu <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </a>
            <button onClick={onBookClick} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-5 sm:px-8 py-3 sm:py-4 rounded-full font-bold transition-all flex-1 sm:flex-none text-sm sm:text-base text-center">
              Book Event
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll Down</span>
        <div className="w-px h-12 bg-white/30" />
      </div>
    </section>
  );
};
