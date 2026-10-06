import React, { useState } from 'react';
import { X, Copy, Check, Share2, Flame, Star, ShieldCheck } from 'lucide-react';

interface ShareProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    streak: string;
    totalPoints: number;
    // Real data, from useProfileShare() — replaces izabi-new's hardcoded "Alex Morgan" demo profile.
    userName?: string;
    institution?: string;
    shareUrl?: string;
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
    isOpen,
    onClose,
    streak,
    totalPoints,
    userName = 'Scholar',
    institution,
    shareUrl = '',
}) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard?.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl max-w-sm w-full p-6 shadow-float relative">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                    <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold text-foreground">Share Study Profile</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-muted/30 border border-border rounded-2xl p-4 text-center mb-4">
                    <h4 className="text-base font-bold text-foreground">{userName}</h4>
                    {institution && <p className="text-xs text-muted-foreground">{institution}</p>}

                    <div className="flex items-center justify-center gap-4 my-3 py-2 border-y border-border">
                        <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span className="font-mono font-bold text-foreground">{streak}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                            <Star className="w-3.5 h-3.5 text-primary" />
                            <span className="font-mono font-bold text-foreground">{totalPoints} XP</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-[11px] text-learning-green font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified Izabi Scholar</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="flex-1 bg-muted/30 border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground/80 select-all"
                        />
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareProfileModal;
