import { Trophy } from 'lucide-react';

type ProgressHeaderProps = {
    studyStreak: number;
};

export default function ProgressHeader({ studyStreak }: ProgressHeaderProps) {
    return (
        <div className="prog-header flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 italic">
                    Your{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                        Performance
                    </span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                    Real-time analytics of your academic growth.
                </p>
            </div>
            {studyStreak > 10 && (
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-primary font-bold">
                    <Trophy size={18} />
                    <span>Top 5% of class</span>
                </div>
            )}
        </div>
    );
}
