import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2, PencilLine, Trash2, X } from 'lucide-react';
import type { NoteGroup } from './noteTypes';

type GroupManagerDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groups: NoteGroup[];
    groupNameDraft: string;
    groupEditingId: string | null;
    groupEditingName: string;
    groupBusyId: string | null;
    onGroupNameDraftChange: (value: string) => void;
    onGroupEditingNameChange: (value: string) => void;
    onCreateGroup: () => void;
    onStartEditGroup: (group: NoteGroup) => void;
    onCancelEditGroup: () => void;
    onUpdateGroup: (groupId: string) => void;
    onDeleteGroup: (groupId: string) => void;
};

export default function GroupManagerDialog({
    open,
    onOpenChange,
    groups,
    groupNameDraft,
    groupEditingId,
    groupEditingName,
    groupBusyId,
    onGroupNameDraftChange,
    onGroupEditingNameChange,
    onCreateGroup,
    onStartEditGroup,
    onCancelEditGroup,
    onUpdateGroup,
    onDeleteGroup,
}: GroupManagerDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass border-foreground/10 rounded-2xl sm:rounded-3xl sm:max-w-xl w-[95vw] p-0 overflow-hidden">
                <DialogHeader className="p-5 sm:p-6 border-b border-foreground/10 bg-card/5">
                    <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                        Manage Groups
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Create, rename, or delete note groups.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            value={groupNameDraft}
                            onChange={(e) =>
                                onGroupNameDraftChange(e.target.value)
                            }
                            placeholder="New group name..."
                            className="rounded-2xl h-11 bg-card/5 border-foreground/10 flex-1"
                        />
                        <Button
                            onClick={onCreateGroup}
                            disabled={groupBusyId === 'create'}
                            className="rounded-2xl h-11 px-5 shadow-glow"
                        >
                            {groupBusyId === 'create' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {groups.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                No groups yet. Create one to organize your
                                notes.
                            </div>
                        ) : (
                            groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-foreground/10 px-4 py-3 bg-card/5"
                                >
                                    {groupEditingId === group.id ? (
                                        <Input
                                            value={groupEditingName}
                                            onChange={(e) =>
                                                onGroupEditingNameChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="rounded-xl h-9 bg-background/60 border-foreground/10 flex-1"
                                        />
                                    ) : (
                                        <span className="font-semibold text-sm">
                                            {group.name}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2">
                                        {groupEditingId === group.id ? (
                                            <>
                                                <Button
                                                    size="icon"
                                                    onClick={() =>
                                                        onUpdateGroup(
                                                            group.id,
                                                        )
                                                    }
                                                    className="h-9 w-9 rounded-xl"
                                                    disabled={
                                                        groupBusyId ===
                                                        group.id
                                                    }
                                                >
                                                    <Check size={16} />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={onCancelEditGroup}
                                                    className="h-9 w-9 rounded-xl"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        onStartEditGroup(group)
                                                    }
                                                    className="h-9 w-9 rounded-xl"
                                                >
                                                    <PencilLine size={16} />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        onDeleteGroup(group.id)
                                                    }
                                                    className="h-9 w-9 rounded-xl text-destructive/70 hover:text-destructive"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
