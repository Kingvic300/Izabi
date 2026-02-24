'use client';

import { useEffect, useMemo, useState } from 'react';
import mermaid from 'mermaid';

type MermaidBlockProps = {
    code: string;
};

const initializeMermaid = (() => {
    let initialized = false;
    return () => {
        if (initialized) return;
        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'neutral',
            flowchart: { useMaxWidth: true },
        });
        initialized = true;
    };
})();

const makeSvgResponsive = (svg: string) => {
    const withStyle = svg.replace(
        '<svg ',
        '<svg style="max-width:100%;height:auto;" ',
    );
    return withStyle
        .replace(/width="[^"]*"/, 'width="100%"')
        .replace(/height="[^"]*"/, 'height="100%"');
};

export const MermaidBlock = ({ code }: MermaidBlockProps) => {
    const [svg, setSvg] = useState('');
    const [error, setError] = useState<string | null>(null);
    const id = useMemo(
        () => `mermaid-${Math.random().toString(36).slice(2, 10)}`,
        [],
    );

    useEffect(() => {
        if (!code.trim()) return;
        let active = true;

        initializeMermaid();
        mermaid
            .render(id, code)
            .then(({ svg }) => {
                if (!active) return;
                setSvg(makeSvgResponsive(svg));
                setError(null);
            })
            .catch((err) => {
                if (!active) return;
                console.error('Mermaid render failed', err);
                setError('Diagram rendering failed.');
            });

        return () => {
            active = false;
        };
    }, [code, id]);

    if (error) {
        return (
            <pre className="whitespace-pre-wrap rounded-2xl border border-foreground/10 bg-background/60 p-4 text-xs text-muted-foreground">
                {code}
            </pre>
        );
    }

    if (!svg) {
        return (
            <div className="rounded-2xl border border-foreground/10 bg-background/60 p-4 text-xs text-muted-foreground">
                Rendering diagram...
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-2xl border border-foreground/10 bg-background/60 p-4">
            <div
                className="w-full"
                aria-label="Summary diagram"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
};
