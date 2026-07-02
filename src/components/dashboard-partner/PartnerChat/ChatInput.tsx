import type React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { NUDGE_PRESETS } from '../partnerUtils';

type ChatInputProps = {
    onSend: (content: string, type: 'message' | 'nudge') => Promise<void>;
};

export default function ChatInput({ onSend }: ChatInputProps) {
    const [value, setValue] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        const trimmed = value.trim();
        if (!trimmed || isSending) return;
        setIsSending(true);
        try {
            await onSend(trimmed, 'message');
            setValue('');
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const handleNudge = async (preset: string) => {
        if (isSending) return;
        setIsSending(true);
        try {
            await onSend(preset, 'nudge');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="p-4 border-t border-foreground/10 space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
                {NUDGE_PRESETS.map((preset) => (
                    <Button
                        key={preset}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleNudge(preset)}
                        disabled={isSending}
                        className="h-8 shrink-0 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    >
                        {preset}
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Send a message..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
                />
                <Button
                    onClick={handleSend}
                    disabled={isSending || !value.trim()}
                    size="icon"
                    className="shrink-0"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
