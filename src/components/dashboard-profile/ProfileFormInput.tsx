import type React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ProfileFormInputProps = {
    label: string;
    icon?: React.ReactNode;
    id: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    placeholder?: string;
};

export default function ProfileFormInput({
    label,
    icon,
    id,
    ...props
}: ProfileFormInputProps) {
    return (
        <div className="space-y-3">
            <Label
                htmlFor={id}
                className="text-xs uppercase font-bold tracking-widest opacity-40 flex items-center gap-2"
            >
                {icon}
                {label}
            </Label>
            <Input
                id={id}
                {...props}
                className="h-14 rounded-2xl glass border-foreground/10 px-4 font-medium transition-all focus:border-primary/50 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
            />
        </div>
    );
}
