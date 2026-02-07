import React, { useEffect, useRef } from 'react';
import { Bird, Flame, Ghost, Heart, Star, Zap } from 'lucide-react';
import gsap from 'gsap';

interface PetProps {
  streak: number;
  petData?: {
    name: string;
    type: string;
    level: number;
    mood: string;
  };
}

const StreakPet: React.FC<PetProps> = ({ streak, petData }) => {
  const petRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (petRef.current) {
      gsap.to(petRef.current, {
        y: -10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  }, []);

  /*
   * How: Selects a visual icon based on the pet's type and mood (happy/sad).
   * Why: Provides visual feedback reflecting the user's study consistency via the pet's emotional state.
   */
  const getPetIcon = () => {
    const type = petData?.type || 'owl';
    const mood = petData?.mood || (streak > 0 ? 'happy' : 'sad');

    if (mood === 'sad') return <Ghost size={64} className="text-gray-400 opacity-50" />;

    switch (type) {
      case 'owl': return <Bird size={64} className="text-primary" />;
      case 'dragon': return <Flame size={64} className="text-primary" />;
      default: return <Bird size={64} className="text-primary" />;
    }
  };

  return (
    <div className="relative group cursor-pointer">
      
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6 glass border-white/5 p-6 rounded-none md:rounded-2xl border-x-0 md:border shadow-none md:shadow-2xl relative z-10 overflow-hidden w-full">
        {/* Animated Background Rays */}
        <div className="absolute inset-0 opacity-10">
        </div>

        <div ref={petRef} className="relative z-10 flex items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10 shadow-inner w-full md:w-auto">
          <div className="scale-75 md:scale-100">
             {getPetIcon()}
          </div>
          {streak > 5 && <Star size={20} className="absolute -top-2 -right-2 text-yellow-500 fill-yellow-500 animate-bounce" />}
        </div>

        <div ref={infoRef} className="space-y-2 w-full md:w-auto flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">Companion</span>
            <div className={`px-2 py-0.5 rounded-xl text-[8px] font-bold uppercase tracking-widest ${streak > 0 ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                {petData?.mood || (streak > 0 ? 'Happy' : 'Sad')}
            </div>
          </div>
          <h3 className="text-2xl font-bold tracking-tighter">{petData?.name || 'Izabi Pet'}</h3>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="flex items-center gap-1 text-primary">
              <Flame size={16} fill="currentColor" />
              <span className="font-bold">{streak} Day Streak</span>
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-xl" />
            <div className="flex items-center gap-1 text-primary">
              <Zap size={16} fill="currentColor" />
              <span className="font-bold">Lvl {petData?.level || 1}</span>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
            <div 
              className="h-full bg-primary shadow-[0_0_10px_#3b82f6] transition-all duration-1000" 
              style={{ width: `${(streak % 5) * 20}%` }} 
            />
        </div>
      </div>
    </div>
  );
};

export default StreakPet;
