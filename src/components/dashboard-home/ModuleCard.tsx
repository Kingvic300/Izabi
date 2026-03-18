'use client';

import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react';
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
        label: 'Standby',
        className: 'bg-card/20 text-muted-foreground/40',
        icon: null,
    },
    processing: {
        label: 'Processing',
        className: 'bg-primary/20 text-primary border-primary/20',
        icon: <Loader2 size={10} className="animate-spin" />,
    },
    completed: {
        label: 'Active',
        className: 'bg-primary/20 text-primary border-primary/20',
        icon: <CheckCircle2 size={10} />,
    },
    failed: {
        label: 'Error',
        className: 'bg-destructive/20 text-destructive border-destructive/20',
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
            className="relative text-left p-8 bg-card/40 hover:bg-card/60 transition-all duration-300 group flex flex-col gap-6 overflow-hidden border-r border-foreground/5 last:border-r-0"
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,_rgba(var(--primary),0.05),_transparent_70%)]" />
            
            <div className="relative flex items-center justify-between">
                <div className={cn('h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg', color)}>
                    <Icon size={28} />
                </div>
                <div className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border',
                    meta.className
                )}>
                    {meta.icon}
                    <span>{meta.label}</span>
                </div>
            </div>

            <div className="relative space-y-2 mt-2">
                <h4 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
                   {label}
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground leading-relaxed">
                    {desc}
                </p>
            </div>

            <div className="relative mt-8 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                <div className="flex items-center gap-2">
                   <div className="h-1 w-1 rounded-full bg-primary/40" />
                   <span>{isProcessing ? 'Synthesizing...' : 'Execute Module'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-foreground/5 border border-foreground/5">
                   <Zap size={10} className="text-primary/60" />
                   <span>{id === 'quiz' ? `${numberOfQuestions} Units` : 'Standard'}</span>
                </div>
            </div>
        </button>
    );
};
