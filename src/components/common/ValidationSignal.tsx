import React from 'react';
import { AlertTriangle, AlertCircle, RefreshCw, Terminal } from 'lucide-react';

interface ValidationSignalProps {
    variant?: 'warning' | 'error';
    title?: string;
    message?: string;
    description?: string;
    timestamp?: string;
    secondaryLabel?: string;
    onAction?: () => void;
    actionText?: string;
    className?: string;
}

export const ValidationSignal: React.FC<ValidationSignalProps> = ({
    variant = 'warning',
    title = 'VALIDATION SIGNAL',
    message = 'Something needs your attention',
    description = '',
    timestamp = '',
    secondaryLabel = 'DETAILS',
    onAction,
    actionText = 'Retry',
    className = '',
}) => {
    const isError = variant === 'error';

    return (
        <div
            role="alert"
            className={`w-full max-w-xl mx-auto rounded-2xl bg-card border border-border p-6 shadow-card relative overflow-hidden transition-all ${className}`}
        >
            <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${
                    isError ? 'bg-destructive/80' : 'bg-primary'
                }`}
            />

            <div className="flex items-start gap-4">
                <div
                    className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${
                        isError
                            ? 'bg-destructive/10 border-destructive/30 text-destructive'
                            : 'bg-primary/10 border-primary/30 text-primary'
                    }`}
                >
                    {isError ? (
                        <AlertCircle className="w-6 h-6" />
                    ) : (
                        <AlertTriangle className="w-6 h-6" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                            className={`text-xs font-semibold tracking-wider uppercase ${
                                isError ? 'text-destructive' : 'text-primary'
                            }`}
                        >
                            {title}
                        </span>
                        {timestamp && (
                            <span className="text-xs font-mono text-muted-foreground tabular-nums">
                                {timestamp}
                            </span>
                        )}
                    </div>

                    <h4 className="text-base font-semibold text-foreground mb-1 leading-snug">
                        {message}
                    </h4>

                    {description && (
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            {description}
                        </p>
                    )}

                    <div className="h-[1px] w-full bg-border my-3" />

                    <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                            <Terminal className="w-3.5 h-3.5" />
                            <span className="uppercase tracking-wider font-medium text-foreground/80">
                                {secondaryLabel}
                            </span>
                        </div>

                        {onAction && (
                            <button
                                type="button"
                                onClick={onAction}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 border border-border text-xs font-medium text-foreground transition-colors cursor-pointer"
                            >
                                <RefreshCw className="w-3 h-3 text-primary" />
                                {actionText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValidationSignal;
