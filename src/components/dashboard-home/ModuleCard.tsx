'use client';

import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { ModuleCardStatus } from '@/components/dashboard-home/types';

interface ModuleCardProps {
    id: string;
    icon: any;
    label: string;
    desc: string;
    color: string;
    status: ModuleCardStatus;
    isProcessing: boolean;
    numberOfQuestions?: number;
    onClick: () => void;
}

const statusMeta: Record<ModuleCardStatus, { label: string; className: string; icon: any }> = {
    idle: {
        label: 'Ready',
        className: 'bg-card/10 text-foreground/60',
        icon: null,
    },
    processing: {
        label: 'Processing',
        className: 'bg-blue-500/15 text-blue-400',
        icon: <Loader2 size={10} className="animate-spin" />,
    },
    completed: {
        label: 'Completed',
        className: 'bg-primary/15 text-primary',
        icon: <CheckCircle2 size={10} />,
    },
    failed: {
        label: 'Failed',
        className: 'bg-destructive/20 text-destructive',
        icon: <XCircle size={10} />,
    },
};

export const ModuleCard = ({
    id,
    icon: Icon,
    label,
    desc,
    color,
    status,
    isProcessing,
    numberOfQuestions,
    onClick,
}: ModuleCardProps) => {
    const meta = statusMeta[status];

    return (
        <button
            onClick={onClick}
            disabled={isProcessing}
            className="relative text-left p-6 sm:p-8 bg-card/90 hover:bg-card/95 active:bg-card/90 transition-all group flex flex-col gap-4"
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_60%)]" />
            <div className="relative flex items-start justify-between gap-4">
                <div className={cn('p-3 rounded-2xl bg-card/10 ring-1 ring-foreground/10 shadow-2xl', color)}>
                    <Icon size={22} />
                </div>
                <div className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.18em]',
                    meta.className
                )}>
                    {meta.icon}
                    <span>{meta.label}</span>
                </div>
            </div>
            <div className="relative space-y-1">
                <div className="text-lg font-bold">{label}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-40">
                    {desc}
                </div>
            </div>
            <div className="relative mt-auto flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                <span>{isProcessing ? 'Working...' : 'Tap to generate'}</span>
                <span className="px-2 py-1 rounded-full bg-foreground/5">
                    {id === 'quiz' ? `${numberOfQuestions} Qs` : 'Run'}
                </span>
            </div>
        </button>
    );
};