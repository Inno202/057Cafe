import { motion } from 'motion/react';
import { Theme } from '../../models/types';
import { Hero } from '../components/Hero';
import { MenuSection } from '../components/MenuSection';
import { EventsSection } from '../components/EventsSection';
import { ContactSection } from '../components/ContactSection';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GallerySection } from '../components/GallerySection';

export const HomePage = ({ theme, toggleTheme, navigateToBooking }: { theme: Theme, toggleTheme: () => void, navigateToBooking: () => void }) => {
  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans ${theme === 'day' ? 'bg-stone-50' : 'bg-stone-950'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero theme={theme} onBookClick={navigateToBooking} />
      <div id="about" className="py-16 md:py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
         >
            <span className="text-amber-600 font-bold uppercase tracking-[0.4em] text-[10px]">Origin Story</span>
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-black mt-4 mb-8 tracking-tighter leading-tight ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>
               THE HEART OF <span className="text-amber-600">STATEWAY.</span> BY THE 057.
            </h2>
            <p className={`text-sm md:text-base leading-relaxed mb-8 ${theme === 'day' ? 'text-stone-600' : 'text-stone-400'}`}>
               Named after our local area code, <strong>057 Cafè Grill & Lounge</strong> is deep-rooted in Welkom culture. We aren't just a place to eat; we are a lifestyle destination where the fire of the grill meets the chill of the lounge.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-10">
               <div className="flex flex-col">
                  <span className={`text-xl md:text-2xl font-black tracking-tighter ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>Grill</span>
                  <span className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mt-1 leading-tight">Traditional Cuisines</span>
               </div>
               <div className="flex flex-col">
                  <span className={`text-xl md:text-2xl font-black tracking-tighter ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>Lounge</span>
                  <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest mt-1 leading-tight">Elite Lifestyle</span>
               </div>
            </div>
            <p className={`text-sm leading-relaxed ${theme === 'day' ? 'text-stone-600' : 'text-stone-400'}`}>
               From our famous "Recovery Ka Mogodu" on Mondays to our "Babalas BlowOut" Sundays, we provide an authentic Mzansi experience that evolves from a vibrant day-spot to a sophisticated night lounge.
            </p>
         </motion.div>
         <div className="relative">
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl aspect-square"
            >
               <img 
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800&h=800" 
                  alt="Premium Grilled Meats" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                  <div className="text-white">
                     <p className="text-lg font-black italic tracking-tighter">"Welkom's ultimate grill experience."</p>
                  </div>
               </div>
            </motion.div>
            <div className={`absolute -bottom-10 -right-10 w-64 h-64 border-8 rounded-full -z-0 ${theme === 'day' ? 'border-amber-100' : 'border-stone-800'}`} />
         </div>
      </div>

      <GallerySection theme={theme} />
      <MenuSection theme={theme} />
      <EventsSection theme={theme} onBookClick={navigateToBooking} />
      <ContactSection theme={theme} />
      <Footer theme={theme} />
    </div>
  );
};
