import { cn } from '@/lib/utils';
import type { HistoryType } from './historyTypes';
import { useLanguage } from '@/contexts/LanguageContext';

type HistoryHeaderProps = {
    activeType: HistoryType;
    onTypeChange: (type: HistoryType) => void;
};

const HISTORY_TYPES: { type: HistoryType; labelKey: string }[] = [
    { type: 'all', labelKey: 'history.type_all' },
    { type: 'generation', labelKey: 'history.type_generation' },
    { type: 'quiz', labelKey: 'history.type_quiz' },
    { type: 'note', labelKey: 'history.type_note' },
    { type: 'chat', labelKey: 'history.type_chat' },
];

export default function HistoryHeader({
    activeType,
    onTypeChange,
}: HistoryHeaderProps) {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {t('history.title')}
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    {t('history.header_subtitle')}
                </p>
            </div>

            <div className="flex bg-card/5 backdrop-blur-xl border border-foreground/5 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                {HISTORY_TYPES.map(({ type, labelKey }) => (
                    <button
                        key={type}
                        onClick={() => onTypeChange(type)}
                        className={cn(
                            'px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all whitespace-nowrap',
                            activeType === type
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                : 'text-muted-foreground hover:bg-foreground/5',
                        )}
                    >
                        {t(labelKey)}
                    </button>
                ))}
            </div>
        </div>
    );
}
