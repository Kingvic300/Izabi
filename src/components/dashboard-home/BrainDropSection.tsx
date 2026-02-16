'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Upload } from 'lucide-react';
import BrainDrop from '@/components/BrainDrop';

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
    if (isCompleted) return null;

    return (
        <div id="brain-drop-section" className="stagger-card">
            {question ? (
                <BrainDrop question={question} onAnswer={onAnswer} />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[24px] sm:rounded-[40px] bg-blue-600/10 border border-blue-500/20 p-5 sm:p-8 md:p-14 text-center group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Brain size={180} className="stroke-blue-500" />
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[28px] bg-blue-500/20 flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/10">
                                <Sparkles size={40} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground tracking-tighter italic">
                                Personalize your{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                    Brain Drop
                                </span>
                            </h3>
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium leading-relaxed opacity-80">
                                Click to Upload Document to add your class notes or textbook PDF. 
                                We'll generate daily personalized challenges to match your learning goals.
                            </p>
                        </div>
                        <button
                            onClick={onUploadClick}
                            className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-[16px] sm:rounded-[20px] bg-blue-600 text-white font-black uppercase tracking-[0.15em] sm:tracking-widest text-[10px] sm:text-xs md:text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95"
                        >
                            <Upload size={20} />
                            Click to Upload Document
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};