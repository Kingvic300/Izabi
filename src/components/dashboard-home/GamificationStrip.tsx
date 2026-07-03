'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Zap, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GamificationStripProps {
    streak: number;
    xp: number;
}

export const GamificationStrip = ({ streak, xp }: GamificationStripProps) => {
    const { t } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                <div className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-orange-500/5">
                        <Flame size={24} fill="currentColor" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            {t('module.active_streak')}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-foreground antialiased italic">
                                {streak} <span className="text-sm not-italic opacity-50">{t('leaderboard.days_label')}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="h-10 w-px bg-foreground/5 hidden sm:block" />

                <div className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/5">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            {t('module.knowledge_xp')}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-foreground antialiased italic">
                                {xp.toLocaleString()} <span className="text-sm not-italic opacity-50">{t('module.pts_suffix')}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="h-10 w-px bg-foreground/5 hidden sm:block" />

                <div className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/5">
                        <Activity size={24} />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            {t('module.study_velocity')}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-foreground antialiased italic">
                                {t('module.high_label')} <span className="text-sm not-italic opacity-50">{t('module.mode_suffix')}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-foreground/5 rounded-2xl p-2 px-4 border border-foreground/5">
                <div className="h-2 w-32 bg-foreground/10 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '65%' }}
                       transition={{ duration: 1, ease: 'easeOut' }}
                       className="h-full bg-primary"
                    />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                    {t('module.level_label')} 12
                </span>
            </div>
        </motion.div>
    );
};
