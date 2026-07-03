'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Upload, Zap } from 'lucide-react';
import BrainDrop from '@/components/BrainDrop';
import { useLanguage } from '@/contexts/LanguageContext';

interface BrainDropSectionProps {
    isCompleted: boolean;
    question: any;
    onAnswer: (answer: string, isCorrect: boolean) => void;
    onUploadClick: () => void;
}

export const BrainDropSection = ({
    isCompleted,
    question,
    onAnswer,
    onUploadClick,
}: BrainDropSectionProps) => {
    const { t } = useLanguage();
    if (isCompleted) return null;

    return (
        <div id="brain-drop-section" className="stagger-card h-full">
            {question ? (
                <BrainDrop question={question} onAnswer={onAnswer} />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative h-full overflow-hidden rounded-[32px] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 p-6 sm:p-8 md:p-10 flex flex-col justify-between group"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
                        <Brain size={240} className="stroke-primary" />
                    </div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                                <Zap size={24} fill="currentColor" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">
                                    {t('module.daily_training')}
                                </span>
                                <h3 className="text-xl font-black tracking-tight">
                                    {t('module.activate_brain_drop')}
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-lg">
                                {t('module.brain_drop_desc')}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                {[t('module.feat_smart_synthesis'), t('module.feat_adaptive_difficulty'), t('module.feat_knowledge_retention')].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/5">
                                        <Sparkles size={10} className="text-primary/50" />
                                        {feat}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 relative z-10">
                       <button
                           onClick={onUploadClick}
                           className="group/btn relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 overflow-hidden"
                       >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                           <Upload size={18} />
                           {t('module.ingest_document')}
                       </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};