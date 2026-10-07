import type React from 'react';
import { Switch } from '@/components/ui/switch';

type SettingRowProps = {
    title: string;
    description: string;
    isChecked: boolean;
    onToggle: (checked?: boolean) => void;
    icon?: React.ReactNode;
    badge?: string;
};

export default function SettingRow({
    title,
    description,
    isChecked,
    onToggle,
    badge,
}: SettingRowProps) {
    const id = `setting-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return (
        <div className="flex items-center justify-between gap-6 px-5 py-4">
            <label htmlFor={id} className="min-w-0 cursor-pointer">
                <span className="flex items-center gap-2 font-bold">
                    {title}
                    {badge && (
                        <span className="text-sm font-normal text-muted-foreground">
                            ({badge})
                        </span>
                    )}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                    {description}
                </span>
            </label>
            <Switch
                id={id}
                checked={isChecked}
                onCheckedChange={(checked) => onToggle(checked)}
            />
        </div>
    );
}
