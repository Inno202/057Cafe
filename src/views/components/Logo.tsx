import { Flame } from 'lucide-react';

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center p-0.5">
       <div className="w-full h-full rounded-full bg-black border border-white flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 border border-white/20 rounded-full scale-90" />
          <Flame className="text-white mb-0.5 z-10" size={16} fill="currentColor" />
          <div className="relative flex items-center justify-center z-10">
             <div className="absolute w-8 h-0.5 bg-white rotate-45" />
             <div className="absolute w-8 h-0.5 bg-white -rotate-45" />
             <div className="absolute -top-3 -left-3 text-white text-[8px] font-bold">|||</div>
             <div className="absolute -top-3 -right-3 text-white text-[8px] font-bold">[]</div>
          </div>
       </div>
    </div>
  </div>
);
