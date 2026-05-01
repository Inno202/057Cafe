import { Instagram, Facebook } from 'lucide-react';
import { Theme } from '../../models/types';

export const Footer = ({ theme }: { theme: Theme }) => {
  return (
    <footer className={`py-16 border-t ${theme === 'day' ? 'bg-stone-50 border-stone-100' : 'bg-stone-950 border-stone-900'}`}>
       <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="text-center md:text-left">
                <div className={`text-2xl font-black mb-2 ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>057 <span className="text-amber-500">CAFE</span></div>
                <p className={`max-w-xs text-xs italic ${theme === 'day' ? 'text-stone-500' : 'text-stone-400'}`}>
                  The heart of Welkom’s social scene. Morning meetings, afternoon meals, and late-night memories.
                </p>
             </div>
             <div className="flex gap-4">
                <button className={`p-4 rounded-2xl transition-all ${theme === 'day' ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}>
                   <Instagram size={20} />
                </button>
                <a 
                  href="https://www.facebook.com/p/057Caf%C3%A8-61564211750260/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-4 rounded-2xl transition-all inline-block ${theme === 'day' ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}
                >
                   <Facebook size={20} />
                </a>
             </div>
          </div>
          <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest ${theme === 'day' ? 'border-stone-100 text-stone-400' : 'border-stone-900 text-stone-600'}`}>
             <span>&copy; 2026 057 Cafe & Lounge. All rights reserved.</span>
             <div className="flex gap-8">
                <a href="#" className="hover:text-amber-600">Privacy</a>
                <a href="#" className="hover:text-amber-600">Terms</a>
             </div>
          </div>
       </div>
    </footer>
  );
};
