'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AIMarkdown } from '@/components/ui/ai-markdown';
import { Volume2, Pause, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/apiClient';
import { useLanguage } from '@/contexts/LanguageContext';

interface SummaryViewerProps {
    content: string;
    audioLabel?: string;
}

export const SummaryViewer = ({ content, audioLabel = 'Listen to Summary' }: SummaryViewerProps) => {
    const { language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isLong = content.length > 800;

    const handlePlaySummary = async () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }

        if (audioRef.current && audioRef.current.src) {
            audioRef.current.play();
            setIsPlaying(true);
            return;
        }

        setIsLoadingAudio(true);
        try {
            const langMap: Record<string, string> = {
                en: 'en',
                pidgin: 'en',
                igbo: 'ig',
                yoruba: 'yo',
                hausa: 'ha',
            };

            const isPidgin = language === 'pidgin';
            const res = await api.generateVoice(
                content.substring(0, 1000),
                langMap[language] || 'en',
                isPidgin,
            );

            if (res.success && res.voiceUrl) {
                const audio = new Audio(res.voiceUrl);
                audioRef.current = audio;

                audio.onended = () => setIsPlaying(false);
                audio.onpause = () => setIsPlaying(false);

                await audio.play();
                setIsPlaying(true);
            }
        } catch (err) {
            console.error('Voice generation failed', err);
        } finally {
            setIsLoadingAudio(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlaySummary}
                    disabled={isLoadingAudio}
                    className="w-full sm:w-auto rounded-full bg-primary/10 text-primary hover:bg-primary/20 gap-2 font-bold text-xs"
                >
                    {isLoadingAudio ? (
                        <Loader2 className="animate-spin h-3 w-3" />
                    ) : isPlaying ? (
                        <Pause className="h-3 w-3" />
                    ) : (
                        <Volume2 className="h-3 w-3" />
                    )}
                    {isPlaying ? 'Pause Audio' : audioLabel}
                </Button>
            </div>

            <div
                className={cn(
                    'selection:bg-primary/30 transition-all duration-700 ease-in-out',
                    !isExpanded && isLong && 'max-h-[400px] overflow-hidden relative',
                )}
            >
                <AIMarkdown content={content} className="text-sm md:text-base" />
                {!isExpanded && isLong && (
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-background/90 pointer-events-none" />
                )}
            </div>
            {isLong && (
                <Button
                    variant="outline"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full h-12 rounded-2xl glass hover:bg-primary/10 text-primary border-primary/20 font-bold tracking-widest uppercase text-[10px] gap-3 shadow-sm"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp size={14} />
                            Collapse
                        </>
                    ) : (
                        <>
                            <ChevronDown size={14} />
                            View Full Summary
                        </>
                    )}
                </Button>
            )}
        </div>
    );
};