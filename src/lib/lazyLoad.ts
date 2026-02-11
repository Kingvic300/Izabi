import { lazy, ComponentType } from 'react';

/**
 * A wrapper for React.lazy that attempts to reload the page if a module load fails.
 * This is useful for handling ChunkLoadErrors when the application has been updated
 * and old chunk references are still in the browser's memory.
 */
export function lazyRetry<T extends ComponentType<any>>(
    componentImport: () => Promise<{ default: T }>,
    name: string,
) {
    return lazy(async () => {
        const hasRetried = window.sessionStorage.getItem(
            `retry-${name}-refreshed`,
        );

        try {
            return await componentImport();
        } catch (error) {
            if (!hasRetried) {
                // The first error might be due to a new deployment
                window.sessionStorage.setItem(
                    `retry-${name}-refreshed`,
                    'true',
                );
                window.location.reload();
            }

            // If we've already retried and it still fails, bubble up the error
            throw error;
        }
    });
}
