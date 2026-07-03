'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { SharePayload } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShareRankDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sharePayload: SharePayload | null;
    onCopy: () => void;
}

export const ShareRankDialog = ({
    open,
    onOpenChange,
    sharePayload,
    onCopy,
}: ShareRankDialogProps) => {
    const { t } = useLanguage();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('leaderboard.share_dialog_title')}</DialogTitle>
                    <DialogDescription>
                        {t('leaderboard.share_dialog_desc')}
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    readOnly
                    value={sharePayload?.shareText || ''}
                    className="min-h-[140px]"
                />
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCopy}
                        disabled={!sharePayload?.shareText}
                    >
                        <Copy className="h-4 w-4" />
                        {t('leaderboard.copy')}
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>
                        {t('leaderboard.done')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};