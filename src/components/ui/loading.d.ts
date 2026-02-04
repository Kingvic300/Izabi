import React from 'react';
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}
export declare const LoadingSpinner: React.FC<LoadingSpinnerProps>;
interface SkeletonLoaderProps {
    variant?: 'card' | 'list-item' | 'text-block' | 'image';
    className?: string;
}
export declare const SkeletonLoader: React.FC<SkeletonLoaderProps>;
export {};
