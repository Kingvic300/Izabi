import { cn } from '@/lib/utils';
import type { HistoryType } from './historyTypes';

type HistoryHeaderProps = {
    activeType: HistoryType;
    onTypeChange: (type: HistoryType) => void;
};

const HISTORY_TYPES: HistoryType[] = [
    'all',
    'generation',
    'quiz',
    'note',
    'chat',
];

export default function HistoryHeader({
    activeType,
    onTypeChange,
}: HistoryHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Learning History
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Tracing your path to excellence, one step at a time.
                </p>
            </div>

            <div className="flex bg-card/5 backdrop-blur-xl border border-foreground/5 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                {HISTORY_TYPES.map((type) => (
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
                        {type === 'generation'
                            ? 'AI Study'
                            : type === 'quiz'
                              ? 'Quizzes'
                              : type}
                    </button>
                ))}
            </div>
        </div>
    );
}
