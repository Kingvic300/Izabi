'use client';

import { AlignLeft } from 'lucide-react';
import { ResultPanel } from './ResultPanel';
import { SummaryViewer } from '@/components/dashboard-home/SummaryViewer';
import { countWords } from '@/lib/quizUtils';
import { SummaryContent, getSummaryText } from '@/lib/summaryUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SummarySectionProps {
    content: SummaryContent;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onDownload: () => void;
    title?: string;
    icon?: any;
    audioLabel?: string;
}

export const SummarySection = ({
    content,
    isOpen,
    onOpenChange,
    onDownload,
    title,
    icon: Icon = AlignLeft,
    audioLabel,
}: SummarySectionProps) => {
    const { t } = useLanguage();
    const resolvedTitle = title ?? t('module.summarize_label');
    const summaryText = getSummaryText(content);
    const wordCount = countWords(summaryText);

    return (
        <ResultPanel
            id="summary-result-section"
            title={resolvedTitle}
            meta={`${wordCount} ${t('module.words_suffix')}`}
            icon={Icon}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onDownload={onDownload}
        >
            <SummaryViewer content={content} audioLabel={audioLabel} />
        </ResultPanel>
    );
};
