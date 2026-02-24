'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { MermaidBlock } from '@/components/ui/mermaid-block';

interface AIMarkdownProps {
    content?: string | null;
    className?: string;
}

const STRUCTURED_MARKDOWN_PATTERN =
    /(^|\n)\s{0,3}(#{1,6}\s|[-*+]\s|\d+[.)]\s|>\s|```)|\|.+\|/m;

const normalizeAIContent = (value?: string | null): string => {
    if (typeof value !== 'string') return '';
    const normalized = value.replace(/\r\n/g, '\n').trim();
    if (!normalized) return '';

    if (
        STRUCTURED_MARKDOWN_PATTERN.test(normalized) ||
        normalized.includes('\n\n')
    ) {
        return normalized;
    }

    if (normalized.includes('\n')) {
        return normalized
            .split('\n')
            .map((line) => line.trimEnd())
            .join('\n');
    }

    const sentenceParts = normalized
        .split(/(?<=[.!?])\s+/)
        .map((part) => part.trim())
        .filter(Boolean);

    if (sentenceParts.length < 3) return normalized;

    const grouped: string[] = [];
    for (let i = 0; i < sentenceParts.length; i += 2) {
        grouped.push(sentenceParts.slice(i, i + 2).join(' '));
    }

    return grouped.join('\n\n');
};

export const AIMarkdown = ({ content, className }: AIMarkdownProps) => {
    return (
        <div className={cn('ai-readable break-words', className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    pre({ children }) {
                        const child = Array.isArray(children)
                            ? children[0]
                            : children;
                        const childClass =
                            (child as any)?.props?.className || '';
                        if (
                            typeof childClass === 'string' &&
                            childClass.toLowerCase().includes('language-mermaid')
                        ) {
                            return <>{children}</>;
                        }
                        return <pre>{children}</pre>;
                    },
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        if (!inline && match?.[1]?.toLowerCase() === 'mermaid') {
                            return (
                                <MermaidBlock
                                    code={String(children || '').trim()}
                                />
                            );
                        }
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {normalizeAIContent(content)}
            </ReactMarkdown>
        </div>
    );
};
