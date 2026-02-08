import React, { useEffect, useRef } from 'react';
import { Bird, Flame, Ghost, Heart, Star, Zap, Utensils } from 'lucide-react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

interface PetProps {
  streak: number;
  petData?: {
    name: string;
    type: string;
    level: number;
    mood: string;
  };
  onFeed?: () => void;
  userPoints?: number;
}

const StreakPet: React.FC<PetProps> = ({ streak, petData, onFeed, userPoints = 0 }) => {
  const petRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [isFeeding, setIsFeeding] = React.useState(false);

  const handleFeed = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFeed && userPoints >= 50) {
        setIsFeeding(true);
        // Animate feeding
        if (petRef.current) {
            gsap.to(petRef.current, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
        }
        await onFeed();
        setTimeout(() => setIsFeeding(false), 1000);
    }
  };

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
    <div className="relative group cursor-pointer w-full md:w-auto">
      
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6 glass border-white/5 p-6 rounded-none md:rounded-2xl border-x-0 md:border shadow-none md:shadow-2xl relative z-10 overflow-hidden w-full transition-all hover:bg-white/[0.02]">
        {/* Animated Background Rays */}
        <div className="absolute inset-0 opacity-10">
        </div>

        <div ref={petRef} className="relative z-10 flex items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10 shadow-inner w-full md:w-auto min-w-[100px] min-h-[100px]">
          <div className="scale-75 md:scale-100 relative">
             {getPetIcon()}
             {isFeeding && (
                 <motion.div 
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -20, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-green-400 font-bold text-xs whitespace-nowrap"
                 >
                    +XP Yummy! 
                 </motion.div>
             )}
          </div>
          {streak > 5 && <Star size={20} className="absolute -top-2 -right-2 text-yellow-500 fill-yellow-500 animate-bounce" />}
        </div>

        <div ref={infoRef} className="space-y-3 w-full md:w-auto flex flex-col items-center md:items-start flex-1">
          <div className="flex items-center gap-2 justify-center md:justify-start w-full">
            <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">Companion</span>
            <div className={`px-2 py-0.5 rounded-xl text-[8px] font-bold uppercase tracking-widest ${streak > 0 ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                {petData?.mood || (streak > 0 ? 'Happy' : 'Sad')}
            </div>
            <div className="ml-auto text-xs font-mono opacity-50">Lvl {petData?.level || 1}</div>
          </div>
          
          <h3 className="text-2xl font-bold tracking-tighter">{petData?.name || 'Izabi Pet'}</h3>
          
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start w-full">
            <div className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-full">
              <Flame size={14} fill="currentColor" />
              <span className="font-bold text-xs">{streak} Day Streak</span>
            </div>
            
            {onFeed && (
                <button 
                    onClick={handleFeed}
                    disabled={userPoints < 50 || isFeeding}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        userPoints >= 50 
                        ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' 
                        : 'bg-gray-500/10 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <Utensils size={14} />
                    {isFeeding ? 'Eating...' : 'Feed (50pts)'}
                </button>
            )}
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
            <div 
              className="h-full bg-gradient-to-r from-primary to-purple-500 shadow-[0_0_10px_#3b82f6] transition-all duration-1000" 
              style={{ width: `${(streak % 5) * 20}%` }} 
            />
        </div>
      </div>
    </div>
  );
};

export default StreakPet;
