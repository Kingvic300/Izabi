import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PageSelectorProps {
    totalPages: number;
    maxPages?: number;
    selectedPages: number[];
    onSelectionChange: (pages: number[]) => void;
    className?: string;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
    totalPages,
    maxPages = Infinity,
    selectedPages,
    onSelectionChange,
    className,
}) => {
    const [rangeStart, setRangeStart] = useState<string>('');
    const [rangeEnd, setRangeEnd] = useState<string>('');
    const [rangeError, setRangeError] = useState<string>('');

    const handleSelectAll = () => {
        const allPages = Array.from(
            { length: Math.min(totalPages, maxPages) },
            (_, i) => i + 1,
        );
        onSelectionChange(allPages);
    };

    const handleClearAll = () => {
        onSelectionChange([]);
    };

    const handleRangeSelect = () => {
        const start = parseInt(rangeStart);
        const end = parseInt(rangeEnd);

        // Validation
        if (!start || !end) {
            setRangeError('Please enter both start and end page numbers');
            return;
        }

        if (start < 1 || end > totalPages) {
            setRangeError(`Page numbers must be between 1 and ${totalPages}`);
            return;
        }

        if (start > end) {
            setRangeError('Start page must be less than or equal to end page');
            return;
        }

        setRangeError('');

        // Create range of pages
        const rangePages = Array.from(
            { length: end - start + 1 },
            (_, i) => start + i,
        );

        // Merge with existing selections (remove duplicates)
        const newSelection = Array.from(
            new Set([...selectedPages, ...rangePages]),
        ).sort((a, b) => a - b);

        if (newSelection.length > maxPages) {
            setRangeError(`You can select at most ${maxPages} pages`);
            return;
        }

        onSelectionChange(newSelection);
        setRangeStart('');
        setRangeEnd('');
    };

    return (
        <div className={cn('space-y-3', className)}>
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground mr-auto">
                    {selectedPages.length} of {totalPages} pages selected
                </span>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {totalPages > maxPages
                        ? `First ${maxPages}`
                        : 'Select all'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    disabled={selectedPages.length === 0}
                >
                    Clear
                </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm">Pages</span>
                <Input
                    aria-label="From page"
                    type="number"
                    min="1"
                    max={totalPages}
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    placeholder="1"
                    className="h-9 w-20"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                    aria-label="To page"
                    type="number"
                    min="1"
                    max={totalPages}
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    placeholder={totalPages.toString()}
                    className="h-9 w-20"
                />
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleRangeSelect}
                    disabled={!rangeStart || !rangeEnd}
                >
                    Add
                </Button>
            </div>
            {rangeError && (
                <p className="text-sm text-destructive">{rangeError}</p>
            )}
        </div>
    );
};

export default PageSelector;
