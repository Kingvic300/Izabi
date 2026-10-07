import {
    Brain,
    ChevronRight,
    Clock,
    FileText,
    ListChecks,
    MessageSquare,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type HistoryListProps = {
    items: any[];
    onSelect: (item: any) => void;
};

const getIcon = (type: string) => {
    switch (type) {
        case 'generation':
            return <Brain />;
        case 'quiz':
            return <ListChecks />;
        case 'note':
            return <FileText />;
        case 'chat':
            return <MessageSquare />;
        default:
            return <Clock />;
    }
};

export default function HistoryList({ items, onSelect }: HistoryListProps) {
    const { t } = useLanguage();
    if (items.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-sheet/45 px-6 py-12">
                <h3 className="text-xl">{t('history.no_items_found')}</h3>
                <p className="mt-1 text-muted-foreground">
                    {t('history.adjust_filters')}
                </p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {items.map((item, index) => (
                <li key={index}>
                    <button
                        type="button"
                        onClick={() => onSelect(item)}
                        className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/50 sm:px-5"
                    >
                        <span className="shrink-0 text-muted-foreground [&>svg]:h-5 [&>svg]:w-5">
                            {getIcon(item.hType)}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate font-bold">
                                {item.title}
                            </span>
                            <span className="tabular mt-0.5 flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                                <span>
                                    {item.hType === 'generation'
                                        ? t('history.ai_material')
                                        : ({ quiz: 'Quiz', note: 'Note', chat: 'Chat' } as Record<string, string>)[item.hType] ?? item.hType}
                                </span>
                                <span>
                                    {new Date(item.hDate).toLocaleDateString()}
                                </span>
                                {item.hType === 'generation' && (
                                    <span>
                                        {item.questions?.length || 0}{' '}
                                        {t('history.questions_suffix')}
                                    </span>
                                )}
                                {item.hType === 'quiz' && (
                                    <span>
                                        {item.correctAnswers}/{item.totalQuestions}{' '}
                                        {t('history.correct_suffix')}
                                    </span>
                                )}
                            </span>
                        </span>
                        {item.score !== undefined && (
                            <span className="tabular shrink-0 font-display text-xl">
                                {Math.round(item.score)}%
                            </span>
                        )}
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </button>
                </li>
            ))}
        </ul>
    );
}
