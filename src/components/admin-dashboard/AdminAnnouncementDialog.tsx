import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

type AdminAnnouncementDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSend: () => void;
    isSending: boolean;
};

export default function AdminAnnouncementDialog({
    open,
    onOpenChange,
    onSend,
    isSending,
}: AdminAnnouncementDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="glass border-primary/20 rounded-3xl p-0 overflow-hidden max-w-[92vw] sm:max-w-md">
                <div className="border-b border-primary/20 bg-primary/5 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <Send size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] font-bold text-primary/70">
                                Broadcast Email
                            </p>
                            <h3 className="font-bold text-base text-foreground">
                                Send Launch Announcement
                            </h3>
                        </div>
                    </div>
                </div>

                <AlertDialogHeader className="px-5 pt-5 pb-0 text-left space-y-2">
                    <AlertDialogTitle className="text-xl font-extrabold tracking-tight">
                        Send announcement to all users?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm leading-relaxed text-foreground/70">
                        This will email every non-admin user with the live
                        announcement and launch link.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="px-5 pb-5 pt-5 gap-2">
                    <AlertDialogCancel
                        disabled={isSending}
                        className="rounded-xl border-foreground/10"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        type="button"
                        onClick={onSend}
                        disabled={isSending}
                        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold min-w-40"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send Now'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
