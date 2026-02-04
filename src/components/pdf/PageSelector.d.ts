import React from 'react';
interface PageSelectorProps {
    totalPages: number;
    selectedPages: number[];
    onSelectionChange: (pages: number[]) => void;
    className?: string;
}
export declare const PageSelector: React.FC<PageSelectorProps>;
export default PageSelector;
