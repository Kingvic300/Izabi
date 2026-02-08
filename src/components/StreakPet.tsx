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
    <div className="fixed bottom-8 right-8 z-[100] group">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        className="relative"
      >
        {/* Main Pet Orb */}
        <div 
            ref={petRef}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-hero border-2 border-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center cursor-pointer relative z-20 overflow-hidden"
        >
          <div className="scale-75 md:scale-90 relative">
             {getPetIcon()}
             {isFeeding && (
                 <motion.div 
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -20, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 text-green-400 font-bold text-xs whitespace-nowrap"
                 >
                    +XP Yummy! 
                 </motion.div>
             )}
          </div>
          {streak > 5 && <Star size={16} className="absolute top-2 right-2 text-yellow-500 fill-yellow-500 animate-pulse" />}
          
          {/* Active Streak Badge */}
          <div className="absolute -bottom-1 -right-1 bg-orange-600 border border-white/20 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-lg">
             <Flame size={10} fill="white" className="text-white" />
             <span className="text-[10px] font-black text-white">{streak}</span>
          </div>
        </div>

        {/* Hover Info Card */}
        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 w-64">
           <div className="glass border-primary/20 p-5 rounded-3xl shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Companion</span>
                <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest">
                  Level {petData?.level || 1}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg leading-tight">{petData?.name || 'Izabi Pet'}</h3>
                <p className="text-[10px] font-medium opacity-50 uppercase tracking-widest">{petData?.mood || (streak > 0 ? 'Extremely Happy' : 'Needs Love')}</p>
              </div>

              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-primary to-purple-500" 
                    style={{ width: `${(streak % 5) * 20 || 20}%` }} 
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                 <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded-lg bg-orange-500/20 text-orange-500"><Flame size={12} fill="currentColor" /></div>
                    <span className="text-xs font-bold">{streak} Day Streak</span>
                 </div>
                 
                 {onFeed && (
                    <button 
                        onClick={handleFeed}
                        disabled={userPoints < 50 || isFeeding}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                            userPoints >= 50 
                            ? 'bg-amber-500 text-black hover:bg-amber-400' 
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }`}
                    >
                        <Utensils size={10} />
                        {isFeeding ? 'Yum!' : 'Feed'}
                    </button>
                 )}
              </div>
           </div>
           
           {/* Speech Bubble Tail */}
           <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#0a0a0a]/50 rotate-45 border-r border-b border-primary/20 backdrop-blur-md" />
        </div>
      </motion.div>
    </div>
  );
};

export default StreakPet;
