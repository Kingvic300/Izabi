'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AIMarkdown } from '@/components/ui/ai-markdown';
import { Volume2, Pause, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/apiClient';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface SummaryViewerProps {
    content: string;
    audioLabel?: string;
}

export const SummaryViewer = ({ content, audioLabel = 'Listen to Summary' }: SummaryViewerProps) => {
    const { language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [voiceId, setVoiceId] = useState('default');
    const [playbackRate, setPlaybackRate] = useState(1);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isLong = content.length > 800;

    const voiceOptions = useMemo(() => {
        if (language === 'pidgin' || language === 'en') {
            return [
                { value: 'default', label: 'Auto (Recommended)' },
                { value: 'en', label: 'English (Neutral)' },
                { value: 'en-us', label: 'English (US)' },
                { value: 'en-gb', label: 'English (UK)' },
                { value: 'en-au', label: 'English (AU)' },
            ];
        }

        if (language === 'igbo') {
            return [
                { value: 'default', label: 'Auto (Recommended)' },
                { value: 'ig', label: 'Igbo' },
            ];
        }
        if (language === 'yoruba') {
            return [
                { value: 'default', label: 'Auto (Recommended)' },
                { value: 'yo', label: 'Yoruba' },
            ];
        }
        if (language === 'hausa') {
            return [
                { value: 'default', label: 'Auto (Recommended)' },
                { value: 'ha', label: 'Hausa' },
            ];
        }

        return [
            { value: 'default', label: 'Auto (Recommended)' },
            { value: 'en', label: 'English (Neutral)' },
        ];
    }, [language]);

    useEffect(() => {
        const savedVoice = localStorage.getItem('izabi_voice_id');
        const savedRate = localStorage.getItem('izabi_voice_rate');
        if (savedVoice) setVoiceId(savedVoice);
        if (savedRate) {
            const parsed = Number(savedRate);
            if (!Number.isNaN(parsed)) setPlaybackRate(parsed);
        }
    }, []);

    useEffect(() => {
        const allowed = voiceOptions.some((option) => option.value === voiceId);
        if (!allowed) {
            setVoiceId('default');
        }
    }, [voiceOptions, voiceId]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
        localStorage.setItem('izabi_voice_rate', String(playbackRate));
    }, [playbackRate]);

    useEffect(() => {
        localStorage.setItem('izabi_voice_id', voiceId);
        // Force re-generation with new voice
        if (audioRef.current) {
            audioRef.current.pause();
        }
        audioRef.current = null;
        setIsPlaying(false);
    }, [voiceId, language]);

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
            const baseLang = langMap[language] || 'en';
            const voiceLang = voiceId !== 'default' ? voiceId : baseLang;
            const res = await api.generateVoice(
                content.substring(0, 1000),
                baseLang,
                isPidgin,
                { voice: voiceLang, speed: playbackRate },
            );

            if (res.success && res.voiceUrl) {
                const audio = new Audio(res.voiceUrl);
                audio.playbackRate = playbackRate;
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
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="min-w-[200px]">
                            <Select
                                value={voiceId}
                                onValueChange={setVoiceId}
                            >
                                <SelectTrigger className="h-10 rounded-2xl bg-background/60 text-xs font-semibold">
                                    <SelectValue placeholder="Voice" />
                                </SelectTrigger>
                                <SelectContent>
                                    {voiceOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 min-w-[180px] rounded-2xl border border-foreground/10 bg-background/60 px-3 py-2">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                <span>Speed</span>
                                <span>{playbackRate.toFixed(2)}x</span>
                            </div>
                            <Slider
                                value={[playbackRate]}
                                onValueChange={(value) =>
                                    setPlaybackRate(value[0] ?? 1)
                                }
                                min={0.8}
                                max={1.2}
                                step={0.05}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Change voice and speed for better listening comfort.
                </p>
            </div>

            <div className="selection:bg-primary/30">
                <AIMarkdown content={content} className="text-sm md:text-base" />
            </div>
        </div>
    );
};
