import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

type SettingRowProps = {
    title: string;
    description: string;
    isChecked: boolean;
    onToggle: (checked?: boolean) => void;
    icon: React.ReactNode;
    badge?: string;
};

export default function SettingRow({
    title,
    description,
    isChecked,
    onToggle,
    icon,
    badge,
}: SettingRowProps) {
    return (
        <div
            onClick={() => onToggle()}
            className="flex items-center justify-between p-8 hover:bg-foreground/[0.02] transition-colors cursor-pointer group"
        >
            <div className="flex items-center gap-6">
                <div
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${isChecked ? 'bg-primary/20 text-primary' : 'bg-foreground/5 text-muted-foreground group-hover:bg-foreground/10'}
                `}
                >
                    {icon}
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg">{title}</h3>
                        {badge && (
                            <Badge
                                variant="outline"
                                className="border-primary/50 text-primary bg-primary/10"
                            >
                                {badge}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm font-medium opacity-60">
                        {description}
                    </p>
                </div>
            </div>
            <Switch
                checked={isChecked}
                onClick={(event) => event.stopPropagation()}
                onCheckedChange={(checked) => onToggle(checked)}
                className="scale-125 data-[state=checked]:bg-primary"
            />
        </div>
    );
}
