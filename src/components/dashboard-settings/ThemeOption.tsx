import type React from 'react';

import { Check } from 'lucide-react';

type ThemeOptionProps = {
    value: string;
    current: string;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
};

export default function ThemeOption({
    value,
    current,
    onClick,
    icon,
    title,
}: ThemeOptionProps) {
    const isActive = current === value;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                group relative p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-4
                ${
                    isActive
                        ? 'bg-primary/20 border-primary text-primary shadow-glow'
                        : 'bg-foreground/5 border-foreground/5 hover:bg-foreground/10 opacity-60 hover:opacity-100'
                }
            `}
        >
            {isActive && (
                <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-xl flex items-center justify-center text-white">
                        <Check size={14} strokeWidth={4} />
                    </div>
                </div>
            )}
            <div
                className={`p-4 rounded-xl ${isActive ? 'bg-primary text-white' : 'bg-foreground/10'}`}
            >
                {icon}
            </div>
            <span className="font-bold tracking-tight">{title}</span>
        </button>
    );
}
