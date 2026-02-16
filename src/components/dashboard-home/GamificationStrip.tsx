'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';

interface GamificationStripProps {
    streak: number;
    xp: number;
}

export const GamificationStrip = ({ streak, xp }: GamificationStripProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <Flame size={20} className="text-blue-500" fill="currentColor" />
                    <span className="text-sm font-bold text-foreground">
                        {streak} day streak
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Trophy size={20} className="text-blue-400" />
                    <span className="text-sm font-bold text-foreground">
                        {xp} XP
                    </span>
                </div>
            </div>
        </motion.div>
    );
};