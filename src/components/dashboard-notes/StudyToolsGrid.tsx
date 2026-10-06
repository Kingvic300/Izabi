import React from 'react';
import { Brain, Zap, Lightbulb, Layers, ArrowRight } from 'lucide-react';

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
        title: 'Analytical Reasoning Drills',
        subtitle: 'High-yield problem deconstruction & proof verification',
        icon: 'brain',
    },
    {
        id: 'quick-test',
        title: 'Timed Recall Sprint',
        subtitle: '5-minute calibrated exam under memory decay intervals',
        icon: 'zap',
        badge: '5 min',
    },
    {
        id: 'study-tricks',
        title: 'Feynman Model Decomposition',
        subtitle: 'Translate complex abstractions into intuitive mental frameworks',
        icon: 'lightbulb',
    },
    {
        id: 'upload-notes',
        title: 'Selective Document Synthesis',
        subtitle: 'Isolate key diagrammatic pages and extract core conceptual matrices',
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
                return Zap;
            case 'lightbulb':
                return Lightbulb;
            case 'layers':
            default:
                return Layers;
        }
    };

    return (
        <div className="my-6">
            <div className="flex items-center justify-between mb-3.5">
                <div>
                    <h3 className="text-lg font-bold text-foreground tracking-tight">
                        Cognitive Synthesis Modes
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Calibrated recall architectures for every curriculum
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {STUDY_TOOLS.map((tool) => {
                    const IconComp = getIcon(tool.icon);
                    const isSelected = selectedToolId === tool.id;

                    return (
                        <button
                            key={tool.id}
                            type="button"
                            onClick={() => onSelectTool(tool.id)}
                            className={`group text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 relative overflow-hidden ${
                                isSelected
                                    ? 'bg-muted border-primary ring-1 ring-primary/40 shadow-card'
                                    : 'bg-card border-border hover:border-primary/30 hover:bg-muted/40 shadow-card'
                            }`}
                        >
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 border ${
                                        isSelected
                                            ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                                            : 'bg-muted border-border text-primary group-hover:border-primary/30'
                                    }`}
                                >
                                    <IconComp className="w-4 h-4" />
                                </div>

                                <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-foreground truncate">
                                        {tool.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate leading-tight">
                                        {tool.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StudyToolsGrid;
