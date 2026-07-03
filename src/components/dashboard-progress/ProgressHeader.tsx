import { Trophy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type ProgressHeaderProps = {
    studyStreak: number;
};

export default function ProgressHeader({ studyStreak }: ProgressHeaderProps) {
    const { t } = useLanguage();
    return (
        <div className="prog-header flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 italic">
                    {t('progress.header_title_top')}{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                        {t('progress.header_title_gradient')}
                    </span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                    {t('progress.header_subtitle')}
                </p>
            </div>
            {studyStreak > 10 && (
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-primary font-bold">
                    <Trophy size={18} />
                    <span>{t('progress.top_percent')}</span>
                </div>
            )}
        </div>
    );
}
