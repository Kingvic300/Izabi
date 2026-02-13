import React, { useEffect, useRef } from 'react';
import { Bird, Flame, Ghost, Heart, Star, Zap, Utensils } from 'lucide-react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    streakFreezes?: number;
    className?: string;
}

const StreakPet: React.FC<PetProps> = ({
    streak,
    petData,
    onFeed,
    userPoints = 0,
    streakFreezes = 0,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const petRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const [isFeeding, setIsFeeding] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const positionKey = 'streak_pet_position_v1';
    const baseOffset = 32; // matches bottom-8/right-8
    const [position, setPosition] = React.useState(() => {
        if (typeof window === 'undefined') return { x: 0, y: 0 };
        try {
            const saved = localStorage.getItem(positionKey);
            if (saved) return JSON.parse(saved);
        } catch {
            // ignore storage errors
        }
        return { x: 0, y: 0 };
    });

    const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max);

    const getBounds = () => {
        if (typeof window === 'undefined') {
            return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
        }
        const rect = petRef.current?.getBoundingClientRect();
        const width = rect?.width || 80;
        const height = rect?.height || 80;
        const defaultLeft = window.innerWidth - baseOffset - width;
        const defaultTop = window.innerHeight - baseOffset - height;
        return {
            minX: -defaultLeft,
            maxX: baseOffset,
            minY: -defaultTop,
            maxY: baseOffset,
        };
    };

    const clampPosition = (pos: { x: number; y: number }) => {
        const bounds = getBounds();
        return {
            x: clamp(pos.x, bounds.minX, bounds.maxX),
            y: clamp(pos.y, bounds.minY, bounds.maxY),
        };
    };

    const persistPosition = (pos: { x: number; y: number }) => {
        try {
            localStorage.setItem(positionKey, JSON.stringify(pos));
        } catch {
            // ignore storage errors
        }
    };

    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleFeed = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onFeed && userPoints >= 50) {
            setIsFeeding(true);
            // Animate feeding
            if (petRef.current) {
                gsap.to(petRef.current, {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                });
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
                ease: 'power1.inOut',
            });
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (containerRef.current && target) {
                if (!containerRef.current.contains(target)) {
                    setIsOpen(false);
                }
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () =>
            document.removeEventListener('pointerdown', handlePointerDown);
    }, [isOpen]);

    useEffect(() => {
        const handleResize = () => {
            setPosition((prev) => {
                const next = clampPosition(prev);
                persistPosition(next);
                return next;
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /*
     * How: Selects a visual icon based on the pet's type and mood (happy/sad).
     * Why: Provides visual feedback reflecting the user's study consistency via the pet's emotional state.
     */
    const getPetIcon = () => {
        const type = petData?.type || 'owl';
        // Default to happy if they just started (streak 0 is common for new users)
        const mood = petData?.mood || (streak >= 0 ? 'happy' : 'sad');

        if (mood === 'sad')
            return (
                <Ghost
                    size={64}
                    className="text-primary-foreground/40 animate-pulse"
                />
            );

        switch (type) {
            case 'owl':
                return (
                    <Bird
                        size={64}
                        className="text-primary-foreground fill-primary-foreground/20"
                    />
                );
            case 'dragon':
                return (
                    <Flame
                        size={64}
                        className="text-primary-foreground fill-primary-foreground/40 text-orange-400"
                    />
                );
            default:
                return <Bird size={64} className="text-primary-foreground" />;
        }
    };

    return (
        <div
            id="streak-pet-container"
            ref={containerRef}
            className={cn('fixed bottom-8 right-8 z-[200] group', className)}
        >
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                drag
                dragMomentum={false}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                    setPosition((prev) => {
                        const next = clampPosition({
                            x: prev.x + info.offset.x,
                            y: prev.y + info.offset.y,
                        });
                        persistPosition(next);
                        return next;
                    });
                }}
                style={{ x: position.x, y: position.y }}
                className="relative"
            >
                {/* Main Pet Orb */}
                <div
                    ref={petRef}
                    onClick={toggleOpen}
                    className={cn(
                        'w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary border-2 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center cursor-pointer relative z-20 overflow-hidden transition-all duration-300',
                        isOpen
                            ? 'border-primary scale-110'
                            : 'border-primary/50',
                    )}
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
                </div>

                {/* Info Card */}
                <div
                    className={cn(
                        'absolute bottom-full right-0 mb-4 transition-all duration-300 w-64',
                        isOpen
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 translate-y-4 pointer-events-none md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto',
                    )}
                >
                    <div className="glass border-primary/20 p-5 rounded-3xl shadow-2xl space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                Companion
                            </span>
                            <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest">
                                Level {petData?.level || 1}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg leading-tight">
                                {petData?.name || 'Izabi Pet'}
                            </h3>
                            <p className="text-[10px] font-medium opacity-50 uppercase tracking-widest">
                                {petData?.mood ||
                                    (streak > 0
                                        ? 'Extremely Happy'
                                        : 'Needs Love')}
                            </p>
                        </div>

                        <div className="h-1.5 w-full bg-card/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${(streak % 5) * 20 || 20}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5">
                                <div className="p-1 rounded-lg bg-orange-500/20 text-orange-500">
                                    <Flame size={10} fill="currentColor" />
                                </div>
                                <span className="text-xs font-bold">
                                    {streak} Day Streak
                                </span>
                            </div>

                            {onFeed && (
                                <div className="flex items-center gap-2">
                                    {streakFreezes > 0 && (
                                        <div className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-500 text-[9px] font-black uppercase flex items-center gap-1">
                                            ❄️ {streakFreezes}
                                        </div>
                                    )}
                                    <button
                                        onClick={handleFeed}
                                        disabled={userPoints < 50 || isFeeding}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                                            userPoints >= 50
                                                ? 'bg-amber-500 text-black hover:bg-amber-400'
                                                : 'bg-card/5 text-foreground/30 cursor-not-allowed'
                                        }`}
                                    >
                                        <Utensils size={10} />
                                        {isFeeding ? 'Yum!' : 'Feed'}
                                    </button>
                                </div>
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
