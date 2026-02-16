import { ShieldAlert } from 'lucide-react';
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

type AdminTerminateDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isTerminating: boolean;
    userDisplayName: string;
    userEmail?: string;
};

export default function AdminTerminateDialog({
    open,
    onOpenChange,
    onConfirm,
    isTerminating,
    userDisplayName,
    userEmail,
}: AdminTerminateDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="glass border-red-500/20 rounded-3xl p-0 overflow-hidden max-w-[92vw] sm:max-w-md">
                <div className="border-b border-red-500/20 bg-red-500/5 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                            <ShieldAlert size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] font-bold text-red-300/70">
                                Security Action
                            </p>
                            <h3 className="font-bold text-base text-red-100">
                                Terminate User Access
                            </h3>
                        </div>
                    </div>
                </div>

                <AlertDialogHeader className="px-5 pt-5 pb-0 text-left space-y-2">
                    <AlertDialogTitle className="text-xl font-extrabold tracking-tight">
                        Confirm account termination
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm leading-relaxed text-foreground/70">
                        You are about to revoke platform access for{' '}
                        <span className="font-bold text-foreground">
                            {userDisplayName}
                        </span>
                        . This user will lose access immediately and must be
                        re-authorized to sign in again.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {userEmail && (
                    <div className="mx-5 mt-4 rounded-2xl border border-foreground/10 bg-card/30 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.12em] font-bold opacity-50 mb-1">
                            Account Email
                        </p>
                        <p className="font-medium break-all">{userEmail}</p>
                    </div>
                )}

                <AlertDialogFooter className="px-5 pb-5 pt-5 gap-2">
                    <AlertDialogCancel
                        disabled={isTerminating}
                        className="rounded-xl border-foreground/10"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isTerminating}
                        className="rounded-xl bg-red-600 hover:bg-red-600/90 text-white font-bold min-w-40"
                    >
                        {isTerminating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Terminating...
                            </>
                        ) : (
                            'Terminate Access'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
