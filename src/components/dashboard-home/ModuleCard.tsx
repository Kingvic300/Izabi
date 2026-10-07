'use client';

import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { ModuleCardStatus } from '@/components/dashboard-home/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ModuleCardProps {
    id: string;
    icon: any;
    labelKey: string;
    descKey: string;
    color: string;
    status: ModuleCardStatus;
    isProcessing: boolean;
    numberOfQuestions?: number;
    onClick: () => void;
}

const statusMeta: Record<
    ModuleCardStatus,
    { labelKey: string; className: string; icon: any } | null
> = {
    idle: null,
    processing: {
        labelKey: 'module.status_processing',
        className: 'text-muted-foreground',
        icon: <Loader2 size={12} className="animate-spin" />,
    },
    completed: {
        labelKey: 'module.status_active',
        className: 'text-reward',
        icon: <CheckCircle2 size={12} />,
    },
    failed: {
        labelKey: 'module.status_error',
        className: 'text-destructive',
        icon: <XCircle size={12} />,
    },
};

export const ModuleCard = ({
    id,
    icon: Icon,
    labelKey,
    descKey,
    color,
    status,
    isProcessing,
    numberOfQuestions,
    onClick,
}: ModuleCardProps) => {
    const { t } = useLanguage();
    const meta = statusMeta[status];

    return (
        <button
            onClick={onClick}
            disabled={isProcessing}
            className="group flex items-start gap-4 p-5 text-left transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <Icon size={20} className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
            <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-lg leading-tight">
                        {t(labelKey)}
                    </span>
                    {meta && (
                        <span
                            className={cn(
                                'inline-flex shrink-0 items-center gap-1 text-sm',
                                meta.className,
                            )}
                        >
                            {meta.icon}
                            {t(meta.labelKey)}
                        </span>
                    )}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                    {t(descKey)}
                    {id === 'quiz' &&
                        `, ${numberOfQuestions} ${t('module.units')}`}
                </span>
            </span>
        </button>
    );
};
