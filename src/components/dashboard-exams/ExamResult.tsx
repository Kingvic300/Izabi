'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

type ExamResultProps = {
    score: number;
    totalQuestions: number;
    onReturn: () => void;
};

export default function ExamResult({
    score,
    totalQuestions,
    onReturn,
}: ExamResultProps) {
    const { t } = useLanguage();
    const correctCount = Math.round((score / 100) * totalQuestions);

    return (
        <div className="w-full text-center space-y-8 sm:space-y-12 pt-8 sm:pt-10 px-4 md:px-8 lg:px-10">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-40 h-40 sm:w-56 sm:h-56 mx-auto rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] mb-6 sm:mb-8 border-4 border-white/10"
            >
                <div className="text-5xl sm:text-7xl font-black text-white">
                    {Math.round(score)}%
                </div>
            </motion.div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tighter">
                {score >= 70
                    ? t('exams.result_excellent')
                    : score >= 50
                      ? t('exams.result_good')
                      : t('exams.result_keep_practicing')}
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground">
                {t('exams.you_answered')} {correctCount} {t('quiz.out_of')} {totalQuestions}{' '}
                {t('exams.questions_correctly')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="p-6 sm:p-10 bg-blue-500/5 border-blue-500/20 rounded-[24px] sm:rounded-[32px] shadow-inner group">
                    <div className="font-black text-blue-500 text-sm uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform">
                        {t('exams.correct_responses')}
                    </div>
                    <div className="text-4xl sm:text-5xl font-black">
                        {correctCount}
                    </div>
                </Card>
                <Card className="p-6 sm:p-10 bg-destructive/5 border-destructive/20 rounded-[24px] sm:rounded-[32px] shadow-inner group">
                    <div className="font-black text-destructive/60 text-sm uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform">
                        {t('exams.incorrect_responses')}
                    </div>
                    <div className="text-4xl sm:text-5xl font-black">
                        {totalQuestions - correctCount}
                    </div>
                </Card>
            </div>

            <Button
                onClick={onReturn}
                className="h-14 sm:h-16 px-8 sm:px-12 rounded-[20px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all active:scale-95"
            >
                {t('exams.return_to_lobby')}
            </Button>
        </div>
    );
}
