import { motion } from 'motion/react';
import { Theme } from '../../models/types';
import { SectionHeader } from './SectionHeader';

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=600&h=600",
  "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=600&h=600",
];

export const GallerySection = ({ theme }: { theme: Theme }) => {
  return (
    <section id="gallery" className={`py-16 md:py-24 ${theme === 'day' ? 'bg-stone-100' : 'bg-black'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="THE VIBE" subtitle="GALLERY" theme={theme} />
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mt-12">
          {GALLERY_IMAGES.map((src, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative aspect-square overflow-hidden rounded-xl md:rounded-3xl group"
            >
              <img 
                src={src} 
                alt={`Gallery image ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold tracking-widest uppercase text-[10px] md:text-xs">View</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
