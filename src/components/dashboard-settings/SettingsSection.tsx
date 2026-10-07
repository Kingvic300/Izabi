import type { ReactNode } from 'react';

export default function SettingsSection({
    title,
    description,
    children,
}: {
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="grid grid-cols-1 gap-4 border-t border-border pt-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
            <div>
                <h3 className="text-xl">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <div className="min-w-0">{children}</div>
        </section>
    );
}
