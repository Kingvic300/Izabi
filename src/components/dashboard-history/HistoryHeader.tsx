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
        <div
            role="tablist"
            aria-label="Filter history"
            className="no-scrollbar flex w-full overflow-x-auto rounded-md bg-muted p-1 md:w-auto"
        >
            {HISTORY_TYPES.map(({ type, labelKey }) => (
                <button
                    key={type}
                    role="tab"
                    aria-selected={activeType === type}
                    onClick={() => onTypeChange(type)}
                    className={cn(
                        'whitespace-nowrap rounded-[5px] px-3.5 py-2 text-sm font-bold transition-colors',
                        activeType === type
                            ? 'bg-card text-foreground shadow-soft'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {t(labelKey)}
                </button>
            ))}
        </div>
    );
}
