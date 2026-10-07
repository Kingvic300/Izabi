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
                className="flex items-center gap-2 text-sm font-bold"
            >
                {icon}
                {label}
            </Label>
            <Input
                id={id}
                {...props}
                className="h-11 text-base disabled:cursor-not-allowed disabled:opacity-60"
            />
        </div>
    );
}
