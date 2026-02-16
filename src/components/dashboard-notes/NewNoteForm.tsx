import { AlertCircle, Folder, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/RichTextEditor';
import type { NoteGroup } from './noteTypes';

type NewNoteDraft = {
    title: string;
    content: string;
    subject: string;
    groupId: string;
};

type NewNoteFormProps = {
    draft: NewNoteDraft;
    groups: NoteGroup[];
    errors: { [key: string]: string | undefined };
    onChange: (updates: Partial<NewNoteDraft>) => void;
    onCancel: () => void;
    onSave: () => void;
    onOpenGroupModal: () => void;
};

export default function NewNoteForm({
    draft,
    groups,
    errors,
    onChange,
    onCancel,
    onSave,
    onOpenGroupModal,
}: NewNoteFormProps) {
    return (
        <Card className="glass shadow-2xl border-foreground/10 overflow-hidden stagger-card">
            <CardHeader className="bg-card/5 border-b border-foreground/5">
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Create New Note</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="title"
                            className="text-xs uppercase tracking-widest font-bold opacity-60"
                        >
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={draft.title}
                            onChange={(e) =>
                                onChange({ title: e.target.value })
                            }
                            placeholder="Enter note title..."
                            className={`rounded-2xl h-12 bg-card/5 border-foreground/10 ${errors.title ? 'border-destructive' : ''}`}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />{' '}
                                {errors.title}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="subject"
                            className="text-xs uppercase tracking-widest font-bold opacity-60"
                        >
                            Subject
                        </Label>
                        <Input
                            id="subject"
                            value={draft.subject}
                            onChange={(e) =>
                                onChange({ subject: e.target.value })
                            }
                            placeholder="e.g., Biology, Math..."
                            className="rounded-2xl h-12 bg-card/5 border-foreground/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-bold opacity-60">
                            Group
                        </Label>
                        <Select
                            value={draft.groupId}
                            onValueChange={(value) => onChange({ groupId: value })}
                        >
                            <SelectTrigger className="rounded-2xl h-12 bg-card/5 border-foreground/10">
                                <SelectValue placeholder="No Group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Group</SelectItem>
                                {groups.map((group) => (
                                    <SelectItem
                                        key={group.id}
                                        value={group.id}
                                    >
                                        {group.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onOpenGroupModal}
                            className="px-2 h-8 text-xs"
                        >
                            <Folder className="h-3 w-3 mr-2" />
                            Create group
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-bold opacity-60">
                        Content
                    </Label>
                    <RichTextEditor
                        content={draft.content}
                        onChange={(val) => onChange({ content: val })}
                        placeholder="Start writing your thoughts..."
                    />
                    {errors.content && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" />{' '}
                            {errors.content}
                        </p>
                    )}
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        className="rounded-2xl h-11 sm:h-12 px-4 sm:px-6 w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={!draft.title.trim() || !draft.content.trim()}
                        className="rounded-2xl h-11 sm:h-12 px-4 sm:px-8 shadow-glow w-full sm:w-auto"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Note
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
