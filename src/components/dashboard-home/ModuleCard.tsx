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
        className: 'text-primary',
        icon: <Loader2 size={12} className="animate-spin" />,
    },
    completed: {
        labelKey: 'module.status_active',
        className: 'text-emerald-500',
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
            className="text-left rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-60 disabled:cursor-not-allowed flex flex-col gap-3"
        >
            <div className="flex items-center justify-between">
                <div
                    className={cn(
                        'h-9 w-9 rounded-lg bg-muted flex items-center justify-center',
                        color,
                    )}
                >
                    <Icon size={18} />
                </div>
                {meta && (
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 text-xs font-medium',
                            meta.className,
                        )}
                    >
                        {meta.icon}
                        {t(meta.labelKey)}
                    </span>
                )}
            </div>
            <div>
                <p className="font-medium">{t(labelKey)}</p>
                <p className="text-sm text-muted-foreground">
                    {t(descKey)}
                    {id === 'quiz' &&
                        ` · ${numberOfQuestions} ${t('module.units')}`}
                </p>
            </div>
        </button>
    );
};
