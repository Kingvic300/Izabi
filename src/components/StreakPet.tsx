import React, { useEffect, useMemo, useRef } from 'react';
import { Flame, Ghost, Star, Utensils } from 'lucide-react';
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
    const [isBlinking, setIsBlinking] = React.useState(false);
    const positionKey = 'streak_pet_position_v1';
    const baseOffset = 32; // matches bottom-8/right-8
    const [dragBounds, setDragBounds] = React.useState<{
        left: number;
        right: number;
        top: number;
        bottom: number;
    } | null>(null);
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

    const computeDragBounds = () => {
        const bounds = getBounds();
        return {
            left: bounds.minX,
            right: bounds.maxX,
            top: bounds.minY,
            bottom: bounds.maxY,
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
        setDragBounds(computeDragBounds());
    }, []);

    useEffect(() => {
        let mounted = true;
        let timeoutId: number | undefined;
        let blinkResetId: number | undefined;
        const scheduleBlink = () => {
            const delay = 4000 + Math.random() * 2000;
            timeoutId = window.setTimeout(() => {
                if (!mounted) return;
                setIsBlinking(true);
                blinkResetId = window.setTimeout(() => {
                    if (mounted) setIsBlinking(false);
                }, 120);
                scheduleBlink();
            }, delay);
        };
        scheduleBlink();
        return () => {
            mounted = false;
            if (timeoutId) window.clearTimeout(timeoutId);
            if (blinkResetId) window.clearTimeout(blinkResetId);
        };
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
            setDragBounds(computeDragBounds());
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
    const level = Math.max(1, Math.ceil(Math.max(streak, 0) / 10));

    const moodState = useMemo(() => {
        const raw = (petData?.mood || '').toLowerCase();
        if (raw.includes('sleep')) return 'sleepy';
        if (raw.includes('excite') || raw.includes('energ')) return 'excited';
        if (raw.includes('sad') || raw.includes('down')) return 'sad';
        if (raw.includes('neutral') || raw.includes('calm')) return 'neutral';
        if (raw.includes('happy') || raw.includes('joy')) return 'happy';
        if (streak <= 0) return 'sad';
        if (streak < 3) return 'neutral';
        return 'happy';
    }, [petData?.mood, streak]);

    const petLabel = useMemo(() => {
        switch (moodState) {
            case 'excited':
                return 'Excited';
            case 'sleepy':
                return 'Sleepy';
            case 'sad':
                return 'A Little Down';
            case 'neutral':
                return 'Calm';
            default:
                return 'Happy';
        }
    }, [moodState]);

    const evolution = useMemo(() => {
        if (level < 2) {
            return {
                stage: 'starter' as const,
                path: null,
                label: 'Starter Owl',
                subtitle: petData?.mood || petLabel,
                badge: `Level ${level}`,
            };
        }

        const rawType = (petData?.type || '').toLowerCase();
        const typePath = rawType.includes('hawk') || rawType.includes('competitive')
            ? 'competitive'
            : rawType.includes('raven') || rawType.includes('wise')
              ? 'wise'
              : rawType.includes('scholar')
                ? 'scholar'
                : null;

        const fallbackPaths = ['scholar', 'competitive', 'wise'] as const;
        const levelPath = fallbackPaths[(level - 2) % fallbackPaths.length];
        const path = typePath ?? levelPath;

        return {
            stage: 'evolved' as const,
            path,
            label:
                path === 'scholar'
                    ? 'Scholar Owl'
                    : path === 'competitive'
                      ? 'Competitive Hawk'
                      : 'Wise Raven',
            subtitle: petData?.mood || petLabel,
            badge: `Level ${level}`,
        };
    }, [level, petData?.type, petData?.mood, petLabel]);

    const petTheme = useMemo(() => {
        if (moodState === 'sad') {
            return {
                body: '#6B88B5',
                bodyDark: '#4C6894',
                belly: '#D8E5F4',
                cheek: '#B5C7E3',
                outline: 'rgba(255,255,255,0.25)',
                eye: '#1F2937',
                pupil: '#111827',
            };
        }
        if (moodState === 'sleepy') {
            return {
                body: '#7CA7FF',
                bodyDark: '#5C84E8',
                belly: '#E7F1FF',
                cheek: '#FFC4D4',
                outline: 'rgba(255,255,255,0.35)',
                eye: '#0F172A',
                pupil: '#0B1220',
            };
        }
        if (moodState === 'excited') {
            return {
                body: '#4FD1FF',
                bodyDark: '#2A8BFF',
                belly: '#F3FBFF',
                cheek: '#FF9DB8',
                outline: 'rgba(255,255,255,0.5)',
                eye: '#0A1020',
                pupil: '#020617',
            };
        }
        if (moodState === 'neutral') {
            return {
                body: '#6FB2FF',
                bodyDark: '#3E7DE6',
                belly: '#EAF4FF',
                cheek: '#FFC0D1',
                outline: 'rgba(255,255,255,0.4)',
                eye: '#0F172A',
                pupil: '#0B1220',
            };
        }
        return {
            body: '#5FA8FF',
            bodyDark: '#2F76E8',
            belly: '#EEF7FF',
            cheek: '#FFB1C6',
            outline: 'rgba(255,255,255,0.45)',
            eye: '#0F172A',
            pupil: '#0B1220',
        };
    }, [moodState]);

    const evolvedTheme = useMemo(() => {
        if (evolution.stage !== 'evolved' || !evolution.path) return petTheme;
        if (moodState === 'sad' || moodState === 'sleepy') return petTheme;
        if (evolution.path === 'competitive') {
            return {
                ...petTheme,
                body: '#FF8A3D',
                bodyDark: '#E35A1C',
                belly: '#FFF1E8',
                cheek: '#FFB07C',
                outline: 'rgba(255,255,255,0.45)',
            };
        }
        if (evolution.path === 'wise') {
            return {
                ...petTheme,
                body: '#5E6C8C',
                bodyDark: '#3D4963',
                belly: '#E6EBF2',
                cheek: '#C2CAD8',
                outline: 'rgba(255,255,255,0.4)',
            };
        }
        return {
            ...petTheme,
            body: '#4C86FF',
            bodyDark: '#2B5BD8',
            belly: '#EAF4FF',
            cheek: '#B6D5FF',
            outline: 'rgba(255,255,255,0.5)',
        };
    }, [evolution.path, evolution.stage, moodState, petTheme]);

    const eyeMood = useMemo(() => {
        if (moodState === 'sad') return { offsetY: 2, scale: 0.9 };
        if (moodState === 'sleepy') return { offsetY: 1, scale: 0.85 };
        if (moodState === 'excited') return { offsetY: -1, scale: 1.05 };
        return { offsetY: 0, scale: 1 };
    }, [moodState]);

    return (
        <div
            id="streak-pet-container"
            ref={containerRef}
            className={cn(
                'fixed bottom-5 right-5 z-[300] group pointer-events-auto sm:bottom-6 sm:right-6',
                className,
            )}
        >
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                drag
                dragMomentum={false}
                dragElastic={0.15}
                dragConstraints={dragBounds ?? undefined}
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
                style={{ x: position.x, y: position.y, touchAction: 'none' }}
                className="relative select-none cursor-grab active:cursor-grabbing"
            >
                {/* Main Pet */}
                <motion.div
                    ref={petRef}
                    onClick={toggleOpen}
                    className={cn(
                        'w-24 h-24 md:w-28 md:h-28 flex items-center justify-center cursor-pointer relative z-20 transition-all duration-300',
                        isOpen
                            ? 'scale-110'
                            : 'scale-100',
                    )}
                    whileTap={{ scale: 0.94 }}
                    style={
                        {
                            '--pet-body': evolvedTheme.body,
                        } as React.CSSProperties
                    }
                >
                    <motion.div
                        className="relative w-[92px] h-[92px] md:w-[108px] md:h-[108px]"
                        animate={{ rotate: moodState === 'sad' ? -4 : -2 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div
                            className="absolute inset-2 rounded-[48%_52%_46%_54%] shadow-[0_18px_40px_rgba(15,23,42,0.25)]"
                            style={{
                                background: `radial-gradient(120% 120% at 30% 20%, ${evolvedTheme.body} 0%, ${evolvedTheme.bodyDark} 70%)`,
                            }}
                        />

                        <div className="absolute -left-1 top-10 w-7 h-8 rounded-[60%_40%_50%_50%] bg-white/12 blur-[1px] rotate-[-12deg]" />
                        <motion.div
                            className="absolute -right-1 top-11 w-7 h-8 rounded-[55%_45%_50%_50%] bg-white/12 blur-[1px] rotate-[18deg]"
                            animate={{ rotate: [18, 24, 18] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />

                        <div
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11 h-8 rounded-[50%_50%_45%_45%] border border-white/40"
                            style={{
                                background: `radial-gradient(100% 100% at 50% 20%, ${evolvedTheme.belly} 0%, rgba(255,255,255,0.15) 70%)`,
                            }}
                        />

                        <div className="absolute top-6 left-7 w-4 h-3 rounded-full opacity-60" style={{ background: evolvedTheme.cheek }} />
                        <div className="absolute top-7 right-7 w-4 h-3 rounded-full opacity-60" style={{ background: evolvedTheme.cheek }} />

                        <div
                            className="absolute top-7 left-6 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center"
                            style={{ transform: `translateY(${eyeMood.offsetY}px) scale(${eyeMood.scale})` }}
                        >
                            <div className="w-3.5 h-3.5 rounded-full" style={{ background: evolvedTheme.pupil }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/90 translate-x-[2px] translate-y-[1px]" />
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-full bg-[var(--pet-body)] origin-center"
                                animate={{
                                    scaleY:
                                        moodState === 'sleepy'
                                            ? 0.4
                                            : isBlinking
                                              ? 1
                                              : 0,
                                }}
                                transition={{ duration: 0.08 }}
                                style={{ background: evolvedTheme.body }}
                            />
                        </div>

                        <div
                            className="absolute top-7 right-6 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center"
                            style={{ transform: `translateY(${eyeMood.offsetY}px) scale(${eyeMood.scale})` }}
                        >
                            <div className="w-3.5 h-3.5 rounded-full" style={{ background: evolvedTheme.pupil }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/90 translate-x-[2px] translate-y-[1px]" />
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-full bg-[var(--pet-body)] origin-center"
                                animate={{
                                    scaleY:
                                        moodState === 'sleepy'
                                            ? 0.4
                                            : isBlinking
                                              ? 1
                                              : 0,
                                }}
                                transition={{ duration: 0.08 }}
                                style={{ background: evolvedTheme.body }}
                            />
                        </div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-2.5 h-2 rounded-[50%_50%_60%_60%] bg-urgent/90 rotate-[5deg]" />

                        {moodState === 'excited' && (
                            <motion.div
                                className="absolute -top-1 -right-1 text-urgent drop-shadow"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 1.6, repeat: Infinity }}
                            >
                                <Star size={14} fill="currentColor" />
                            </motion.div>
                        )}

                        {moodState === 'sad' && (
                            <Ghost
                                size={26}
                                className="absolute -bottom-1 right-1 text-background/50"
                            />
                        )}
                    </motion.div>

                    {isFeeding && (
                        <motion.div
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: -20, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 text-reward font-bold text-xs whitespace-nowrap"
                        >
                            +XP Yummy!
                        </motion.div>
                    )}
                </motion.div>

                {/* Info Card */}
                <div
                    className={cn(
                        'absolute bottom-full right-0 mb-4 transition-all duration-300 w-64',
                        isOpen
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 translate-y-4 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto',
                    )}
                >
                    <div className="space-y-3 rounded-lg border border-border bg-popover p-5 shadow-float">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Companion
                            </span>
                            <div className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold">
                                {evolution.badge}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl leading-tight">
                                {evolution.label}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {evolution.subtitle}
                            </p>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            Personality: Encouraging, Slightly Dramatic
                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full bg-foreground"
                                style={{ width: `${(streak % 5) * 20 || 20}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5">
                                <div className="p-1 rounded-lg bg-urgent/20 text-urgent">
                                    <Flame size={10} fill="currentColor" />
                                </div>
                                <span className="text-xs font-bold">
                                    {streak} Day Streak
                                </span>
                            </div>

                            {onFeed && (
                                <div className="flex items-center gap-2">
                                    {streakFreezes > 0 && (
                                        <div className="px-2 py-0.5 rounded-full bg-learning-blue/20 text-learning-blue text-xs font-semibold flex items-center gap-1">
                                            ❄️ {streakFreezes}
                                        </div>
                                    )}
                                    <button
                                        onClick={handleFeed}
                                        disabled={userPoints < 50 || isFeeding}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                            userPoints >= 50
                                                ? 'bg-urgent text-black hover:bg-urgent'
                                                : 'bg-card text-foreground/30 cursor-not-allowed'
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
                    <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b border-r border-border bg-popover" />
                </div>
            </motion.div>
        </div>
    );
};

export default StreakPet;
