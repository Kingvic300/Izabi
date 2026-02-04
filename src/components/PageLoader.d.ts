import type React from "react";
interface PageLoaderProps {
    variant?: "spinner" | "skeleton-cards" | "skeleton-list";
    itemCount?: number;
    text?: string;
}
export declare const PageLoader: React.FC<PageLoaderProps>;
export {};
