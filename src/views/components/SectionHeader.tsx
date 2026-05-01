import { motion } from 'motion/react';
import { Theme } from '../../models/types';

export const SectionHeader = ({ title, subtitle, theme }: { title: string, subtitle: string, theme: Theme }) => (
  <div className="text-center mb-16">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-amber-600 font-bold uppercase tracking-[0.4em] text-[10px]"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className={`text-2xl md:text-3xl lg:text-4xl font-black mt-2 tracking-tighter ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}
    >
      {title}
    </motion.h2>
    <div className={`h-1 w-24 mx-auto mt-6 rounded-full ${theme === 'day' ? 'bg-amber-600' : 'bg-amber-400'}`} />
  </div>
);
