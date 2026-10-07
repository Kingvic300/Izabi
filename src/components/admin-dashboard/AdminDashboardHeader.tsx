import { RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type AdminDashboardHeaderProps = {
    onOpenAnnouncement: () => void;
    onSyncRegistry: () => void;
    onExportReport: () => void;
    isSendingAnnouncement: boolean;
    isSyncingRegistry: boolean;
    isExportingReport: boolean;
};

export default function AdminDashboardHeader({
    onOpenAnnouncement,
    onSyncRegistry,
    onExportReport,
    isSendingAnnouncement,
    isSyncingRegistry,
    isExportingReport,
}: AdminDashboardHeaderProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button
                variant="outline"
                onClick={onOpenAnnouncement}
                disabled={isSendingAnnouncement}
            >
                {isSendingAnnouncement ? <Loader2 className="animate-spin" /> : <Send />}
                Send launch email
            </Button>
            <Button
                variant="outline"
                onClick={onSyncRegistry}
                disabled={isSyncingRegistry}
            >
                {isSyncingRegistry ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                Refresh users
            </Button>
            <Button onClick={onExportReport} disabled={isExportingReport}>
                {isExportingReport && <Loader2 className="animate-spin" />}
                {isExportingReport ? 'Exporting…' : 'Download report'}
            </Button>
        </div>
    );
}
