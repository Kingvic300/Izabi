import { Folder, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NoteGroup } from './noteTypes';

type GroupFilterBarProps = {
    groups: NoteGroup[];
    groupFilter: string;
    isNotesRefreshing: boolean;
    onFilterChange: (value: string) => void;
    onOpenGroupModal: () => void;
};

export default function GroupFilterBar({
    groups,
    groupFilter,
    isNotesRefreshing,
    onFilterChange,
    onOpenGroupModal,
}: GroupFilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap gap-2">
                <Button
                    size="sm"
                    variant={groupFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => onFilterChange('all')}
                    className="rounded-2xl"
                >
                    All Notes
                </Button>
                <Button
                    size="sm"
                    variant={groupFilter === 'none' ? 'default' : 'outline'}
                    onClick={() => onFilterChange('none')}
                    className="rounded-2xl"
                >
                    No Group
                </Button>
                {groups.map((group) => (
                    <Button
                        key={group.id}
                        size="sm"
                        variant={
                            groupFilter === group.id
                                ? 'default'
                                : 'outline'
                        }
                        onClick={() => onFilterChange(group.id)}
                        className="rounded-2xl"
                    >
                        {group.name}
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-3">
                {isNotesRefreshing && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Refreshing...
                    </div>
                )}
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onOpenGroupModal}
                    className="rounded-2xl"
                >
                    <Folder className="h-4 w-4 mr-2" />
                    Create Group
                </Button>
            </div>
        </div>
    );
}
