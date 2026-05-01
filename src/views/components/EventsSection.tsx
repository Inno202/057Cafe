import { motion } from 'motion/react';
import { Music, Clock } from 'lucide-react';
import { EVENTS } from '../../models/data';
import { Theme } from '../../models/types';
import { SectionHeader } from './SectionHeader';

export const EventsSection = ({ theme, onBookClick }: { theme: Theme, onBookClick?: () => void }) => {
  return (
    <section id="events" className={`py-16 md:py-24 relative overflow-hidden ${theme === 'day' ? 'bg-stone-50' : 'bg-black'}`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader title="THE WEEKEND VIBE" subtitle="UPCOMING EVENTS" theme={theme} />

        <div className="grid md:grid-cols-3 gap-8">
          {EVENTS.map((event, i) => (
            <motion.div 
              key={event.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group p-8 rounded-3xl transition-all duration-500 flex flex-col h-full border ${
                theme === 'day' 
                  ? 'bg-white border-stone-200 hover:shadow-xl hover:-translate-y-2' 
                  : 'bg-stone-900 border-stone-800 hover:border-amber-400/50 hover:shadow-[0_20px_50px_rgba(251,191,36,0.1)] hover:-translate-y-2'
              }`}
            >
              <div className={`text-3xl font-black italic mb-6 opacity-20 ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>
                {event.day}
              </div>
              <Music className="text-amber-500 mb-4" size={28} />
              <h3 className={`text-xl font-bold mb-2 ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>{event.title}</h3>
              <div className="flex items-center gap-2 text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-4">
                <Clock size={14} /> {event.time}
              </div>
              <p className={`text-xs md:text-sm leading-relaxed mb-6 flex-grow ${theme === 'day' ? 'text-stone-500' : 'text-stone-400'}`}>
                {event.description}
              </p>
              <button 
                onClick={onBookClick}
                className={`w-full py-3 rounded-xl font-bold tracking-widest text-[10px] uppercase border transition-all ${
                theme === 'day' 
                  ? 'border-stone-200 text-stone-700 hover:bg-stone-900 hover:text-white' 
                  : 'border-stone-700 text-stone-300 hover:border-amber-400 hover:text-amber-400'
              }`}>
                RSVP Now
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <div className={`p-6 md:p-10 rounded-[2rem] inline-block max-w-4xl mx-auto shadow-inner ${theme === 'day' ? 'bg-white border border-stone-100' : 'bg-stone-950 border border-stone-900'}`}>
                <h4 className={`text-lg md:text-2xl font-black mb-4 ${theme === 'day' ? 'text-stone-800' : 'text-amber-100'}`}>Planning a Private Celebration?</h4>
                <p className={`text-sm md:text-base mb-8 italic ${theme === 'day' ? 'text-stone-500' : 'text-stone-400'}`}>
                   "Convert our space into your sanctuary. We host birthdays, corporate mixers, and traditional festivities."
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full">
                   <button 
                    onClick={onBookClick}
                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold shadow-lg transition-all text-xs sm:text-sm">
                      Inquire About Venue Hire
                   </button>
                   <button className={`w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold border transition-all text-xs sm:text-sm ${theme === 'day' ? 'border-stone-200 text-stone-700 hover:bg-stone-50' : 'border-stone-800 text-stone-300 hover:bg-stone-900'}`}>
                      Download Event Brochure
                   </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
