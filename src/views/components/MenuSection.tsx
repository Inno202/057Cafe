import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, ChevronRight } from 'lucide-react';
import { MENU_ITEMS } from '../../models/data';
import { Theme } from '../../models/types';
import { SectionHeader } from './SectionHeader';

export const MenuSection = ({ theme }: { theme: Theme }) => {
  const [filter, setFilter] = useState<'all' | 'breakfast' | 'lunch' | 'african' | 'drinks'>('all');
  
  const filteredItems = filter === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === filter);

  return (
    <section id="menu" className={`py-16 md:py-24 ${theme === 'day' ? 'bg-white' : 'bg-stone-900'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="THE TASTE OF 057" subtitle="OUR MENU" theme={theme} />
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'breakfast', 'lunch', 'african', 'drinks'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                filter === cat 
                  ? (theme === 'day' ? 'bg-amber-700 border-amber-700 text-white' : 'bg-amber-500 border-amber-500 text-black')
                  : (theme === 'day' ? 'bg-transparent border-stone-200 text-stone-600 hover:border-amber-600' : 'bg-transparent border-stone-700 text-stone-400 hover:border-amber-400')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`col-span-1 md:col-span-2 py-16 text-center ${theme === 'day' ? 'text-stone-500' : 'text-stone-400'}`}
              >
                <div className="text-3xl mb-4 opacity-50">🍽️</div>
                <h3 className={`text-lg font-black mb-2 ${theme === 'day' ? 'text-stone-900' : 'text-stone-100'}`}>Ooops</h3>
                <p className="italic">"Too popular to stay in the kitchen. Try again tomorrow!"</p>
              </motion.div>
            ) : (
              filteredItems.map((item) => (
                <motion.div 
                  key={item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group flex items-start justify-between pb-6 border-b transition-colors ${theme === 'day' ? 'border-stone-100 hover:border-amber-200' : 'border-stone-800 hover:border-stone-700'}`}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-base font-bold ${theme === 'day' ? 'text-stone-900' : 'text-stone-100'}`}>{item.name}</h3>
                      {item.category === 'african' && (
                         <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Native</span>
                      )}
                    </div>
                    <p className={`text-xs md:text-sm ${theme === 'day' ? 'text-stone-500' : 'text-stone-400'}`}>{item.description}</p>
                  </div>
                  <span className={`text-lg font-black ${theme === 'day' ? 'text-amber-700' : 'text-amber-400'}`}>{item.price}</span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {(filter === 'all' || filter === 'drinks') && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className={`mt-10 py-6 px-8 rounded-2xl text-center border-dashed border-2 flex flex-col items-center gap-3 ${theme === 'day' ? 'border-stone-200 bg-stone-50/50' : 'border-stone-800 bg-stone-950/50'}`}
           >
             <p className={`text-xs md:text-sm font-medium ${theme === 'day' ? 'text-stone-600' : 'text-stone-400'}`}>
                <strong className={`font-black uppercase tracking-widest ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>Full Bar Available:</strong> We offer a wide range of beverages including crisp ciders, local & international beers, artisanal cocktails, fine wines, and premium bottle service.
             </p>
           </motion.div>
        )}

        <div className="mt-16 flex flex-col items-center gap-6">
          <button className={`flex items-center gap-2 text-sm font-bold underline underline-offset-8 transition-colors ${theme === 'day' ? 'text-stone-600 hover:text-amber-700' : 'text-stone-400 hover:text-amber-400'}`}>
            <Download size={18} /> Download PDF Menu (2.4 MB)
          </button>
          
          <div className={`p-8 rounded-3xl w-full max-w-4xl flex flex-col md:flex-row items-center gap-10 mt-10 shadow-2xl ${theme === 'day' ? 'bg-stone-50' : 'bg-stone-950'}`}>
            <div className="w-full md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800&h=600" 
                alt="African Cuisine" 
                className="rounded-2xl w-full h-full object-cover shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-amber-600 font-bold uppercase tracking-widest text-[10px]">A Taste of Home</span>
              <h4 className={`text-xl md:text-2xl font-black mt-2 mb-4 ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>Authentic African Flavors</h4>
              <p className={`text-sm mb-6 leading-relaxed ${theme === 'day' ? 'text-stone-600' : 'text-stone-400'}`}>
                Our specialty menu celebrates the rich culinary heritage of Africa. From traditional pap and mogodu to firewood-grilled brisket, we bring the authentic taste of the ancestors to a modern plate.
              </p>
              <button className="text-amber-600 font-black flex items-center gap-2 hover:gap-4 transition-all">
                Explore Culinary Heritage <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
