import { RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        <header className="flex flex-col lg:flex-row lg:items-center justify-end gap-4 md:gap-6 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 lg:gap-6 w-full lg:w-auto lg:justify-end">
                <Button
                    variant="outline"
                    onClick={onOpenAnnouncement}
                    disabled={isSendingAnnouncement}
                    className="glass h-11 md:h-12 rounded-2xl border-foreground/10 hover:bg-card/5 transition-all w-full lg:w-auto"
                >
                    {isSendingAnnouncement ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Launch Email
                </Button>
                <Button
                    variant="outline"
                    onClick={onSyncRegistry}
                    disabled={isSyncingRegistry}
                    className="glass h-11 md:h-12 rounded-2xl border-foreground/10 hover:bg-card/5 transition-all w-full lg:w-auto"
                >
                    {isSyncingRegistry ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                    )}{' '}
                    Sync Registry
                </Button>
                <Button
                    onClick={onExportReport}
                    disabled={isExportingReport}
                    className="h-11 md:h-12 rounded-2xl bg-primary shadow-glow hover:bg-primary/90 font-bold px-6 md:px-8 w-full lg:w-auto"
                >
                    {isExportingReport ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        'System Report'
                    )}
                </Button>
            </div>
        </header>
    );
}
