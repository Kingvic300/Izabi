export type StructuredSummary = {
    summary: string;
    keyConcepts: string[];
    definitions: Array<{ term: string; definition: string }>;
    simplifiedExplanation: string;
    quiz: Array<{
        type: 'multiple_choice' | 'short_answer';
        question: string;
        options?: string[];
        answer: string;
    }>;
};

export type SummaryContent = StructuredSummary | string | null;

const isStructuredSummary = (value: any): value is StructuredSummary => {
    return (
        value &&
        typeof value === 'object' &&
        typeof value.summary === 'string' &&
        Array.isArray(value.keyConcepts) &&
        Array.isArray(value.definitions) &&
        typeof value.simplifiedExplanation === 'string' &&
        Array.isArray(value.quiz)
    );
};

export const parseStructuredSummary = (value: unknown): StructuredSummary | null => {
    if (!value) return null;
    if (isStructuredSummary(value)) return value;
    if (typeof value !== 'string') return null;

    const trimmed = value.trim();
    if (!trimmed.startsWith('{')) return null;
    try {
        const parsed = JSON.parse(trimmed);
        return isStructuredSummary(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

export const normalizeSummaryContent = (value: unknown): SummaryContent => {
    const structured = parseStructuredSummary(value);
    if (structured) return structured;
    if (typeof value === 'string') return value;
    return null;
};

export const getSummaryText = (value: SummaryContent): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.summary || '';
};

export const formatSummaryForDownload = (value: SummaryContent): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;

    const lines: string[] = [];
    lines.push('# Izabi Structured Summary');
    lines.push('');
    lines.push('## Summary');
    lines.push(value.summary || '');
    lines.push('');
    lines.push('## Key Concepts');
    if (value.keyConcepts.length) {
        value.keyConcepts.forEach((concept) => {
            lines.push(`- ${concept}`);
        });
    } else {
        lines.push('- No key concepts extracted.');
    }
    lines.push('');
    lines.push('## Definitions');
    if (value.definitions.length) {
        value.definitions.forEach((item) => {
            lines.push(`- **${item.term}**: ${item.definition}`);
        });
    } else {
        lines.push('- No definitions extracted.');
    }
    lines.push('');
    lines.push('## Simplified Explanation');
    lines.push(value.simplifiedExplanation || '');
    lines.push('');
    lines.push('## Quiz');
    if (value.quiz.length) {
        value.quiz.forEach((q, idx) => {
            lines.push(`${idx + 1}. ${q.question}`);
            if (q.type === 'multiple_choice' && q.options?.length) {
                q.options.forEach((opt, optIdx) => {
                    const label = String.fromCharCode(65 + optIdx);
                    lines.push(`   ${label}. ${opt}`);
                });
            }
            lines.push(`   Answer: ${q.answer}`);
        });
    } else {
        lines.push('No quiz questions generated.');
    }

    return lines.join('\n');
};
