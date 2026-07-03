'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Brain, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { SummaryViewer } from '@/components/dashboard-home/SummaryViewer';
import { countWords } from '@/lib/quizUtils';
import { cn } from '@/lib/utils';
import { SummaryContent, getSummaryText } from '@/lib/summaryUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SummarySectionProps {
    content: SummaryContent;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onDownload: () => void;
    title?: string;
    icon?: any;
    iconColor?: string;
    audioLabel?: string;
}

export const SummarySection = ({
    content,
    isOpen,
    onOpenChange,
    onDownload,
    title,
    icon: Icon = Brain,
    iconColor = 'text-blue-400',
    audioLabel,
}: SummarySectionProps) => {
    const { t } = useLanguage();
    const resolvedTitle = title ?? t('module.summarize_label');
    const summaryText = getSummaryText(content);
    const wordCount = countWords(summaryText);

    return (
        <div id="summary-result-section">
            <Collapsible open={isOpen} onOpenChange={onOpenChange}>
                <Card className="relative glass border-foreground/5 rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl bg-gradient-to-br from-card/70 via-card/40 to-background/90">
                    <CollapsibleTrigger asChild>
                        <button className="w-full text-left p-4 sm:p-6 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform", iconColor)}>
                                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl md:text-2xl font-bold leading-tight">
                                            {resolvedTitle}
                                        </h3>
                                        <div className="px-2.5 py-1 rounded-full bg-foreground/5 text-[9px] font-black uppercase tracking-[0.18em] opacity-60">
                                            {wordCount} {t('module.words_suffix')}
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-40">
                                        {t('module.key_points_distilled')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-3xl glass hover:bg-primary/20 text-primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDownload();
                                    }}
                                >
                                    <Download size={18} />
                                </Button>
                                <div className="w-10 h-10 rounded-3xl glass flex items-center justify-center group-hover:bg-card/5 transition-all">
                                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="px-4 sm:px-6 md:px-16 pb-8 sm:pb-10 md:pb-16 pt-2">
                            <SummaryViewer content={content} audioLabel={audioLabel} />
                        </div>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        </div>
    );
};
