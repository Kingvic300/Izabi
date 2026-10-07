import type { ReactNode } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface ResultPanelProps {
    id?: string;
    title: string;
    meta?: ReactNode;
    icon?: React.ElementType;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onDownload?: () => void;
    downloadLabel?: string;
    children: ReactNode;
}

export function ResultPanel({
    id,
    title,
    meta,
    icon: Icon,
    isOpen,
    onOpenChange,
    onDownload,
    downloadLabel = 'Download',
    children,
}: ResultPanelProps) {
    return (
        <section id={id}>
            <Collapsible open={isOpen} onOpenChange={onOpenChange}>
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2 pr-3">
                        <CollapsibleTrigger asChild>
                            <button className="group flex min-w-0 flex-1 items-center gap-4 px-5 py-4 text-left sm:px-6">
                                {Icon && (
                                    <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                                )}
                                <span className="min-w-0 flex-1">
                                    <span className="block font-display text-xl leading-tight">
                                        {title}
                                    </span>
                                    {meta && (
                                        <span className="tabular mt-0.5 block text-sm text-muted-foreground">
                                            {meta}
                                        </span>
                                    )}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        'h-5 w-5 shrink-0 text-muted-foreground transition-transform',
                                        isOpen && 'rotate-180',
                                    )}
                                />
                            </button>
                        </CollapsibleTrigger>
                        {onDownload && (
                            <button
                                type="button"
                                onClick={onDownload}
                                aria-label={`${downloadLabel}: ${title}`}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <Download className="h-[18px] w-[18px]" />
                            </button>
                        )}
                    </div>
                    <CollapsibleContent>
                        <div className="border-t border-border px-5 pb-8 pt-6 sm:px-8 lg:px-12">
                            {children}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </section>
    );
}
