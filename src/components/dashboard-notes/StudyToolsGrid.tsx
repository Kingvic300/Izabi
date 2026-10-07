import React from 'react';
import { Brain, Timer, Lightbulb, FileUp, ArrowRight } from 'lucide-react';

export type StudyToolId = 'practice' | 'quick-test' | 'study-tricks' | 'upload-notes';

export interface StudyToolDef {
    id: StudyToolId;
    title: string;
    subtitle: string;
    icon: 'brain' | 'zap' | 'lightbulb' | 'layers';
    badge?: string;
}

export const STUDY_TOOLS: StudyToolDef[] = [
    {
        id: 'practice',
        title: 'Practice skills',
        subtitle: 'Short reasoning drills with worked answers',
        icon: 'brain',
    },
    {
        id: 'quick-test',
        title: 'Quick test',
        subtitle: 'A timed set for a short break',
        icon: 'zap',
        badge: '5 min',
    },
    {
        id: 'study-tricks',
        title: 'Study tricks',
        subtitle: 'Explain a topic simply so it sticks',
        icon: 'lightbulb',
    },
    {
        id: 'upload-notes',
        title: 'Import a note',
        subtitle: 'Bring in a PDF, Word file or text file',
        icon: 'layers',
    },
];

interface StudyToolsGridProps {
    onSelectTool: (toolId: StudyToolId) => void;
    selectedToolId?: StudyToolId | null;
}

export const StudyToolsGrid: React.FC<StudyToolsGridProps> = ({
    onSelectTool,
    selectedToolId,
}) => {
    const getIcon = (iconName: StudyToolDef['icon']) => {
        switch (iconName) {
            case 'brain':
                return Brain;
            case 'zap':
                return Timer;
            case 'lightbulb':
                return Lightbulb;
            case 'layers':
            default:
                return FileUp;
        }
    };

    return (
        <section aria-labelledby="study-tools-title">
            <h3 id="study-tools-title" className="mb-4 text-2xl">
                Study from your notes
            </h3>
            <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-2">
                {STUDY_TOOLS.map((tool, i) => {
                    const IconComp = getIcon(tool.icon);
                    const isSelected = selectedToolId === tool.id;
                    return (
                        <button
                            key={tool.id}
                            type="button"
                            onClick={() => onSelectTool(tool.id)}
                            aria-pressed={isSelected}
                            className={[
                                'group flex items-center gap-4 border-border px-5 py-4 text-left transition-colors hover:bg-muted/50',
                                i > 0 ? 'border-t' : '',
                                i === 1 ? 'sm:border-t-0' : '',
                                i % 2 === 1 ? 'sm:border-l' : '',
                                isSelected ? 'bg-muted/60' : '',
                            ].join(' ')}
                        >
                            <IconComp className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                            <span className="min-w-0 flex-1">
                                <span className="flex items-baseline gap-2 font-bold">
                                    {tool.title}
                                    {tool.badge && (
                                        <span className="text-sm font-normal text-muted-foreground">
                                            {tool.badge}
                                        </span>
                                    )}
                                </span>
                                <span className="block truncate text-sm text-muted-foreground">
                                    {tool.subtitle}
                                </span>
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default StudyToolsGrid;
