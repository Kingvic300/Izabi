import { Filter, MoreVertical, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MouseEvent } from 'react';
import type { AdminUser } from './adminTypes';

type AdminUsersTabProps = {
    filteredUsers: AdminUser[];
    searchQuery: string;
    onSearchChange: (value: string) => void;
    showActiveOnly: boolean;
    onToggleActiveOnly: () => void;
    onFilterAction: () => void;
    onViewUser: (userId: string) => void;
    onDeleteUser: (user: AdminUser, event: MouseEvent) => void;
};

export default function AdminUsersTab({
    filteredUsers,
    searchQuery,
    onSearchChange,
    showActiveOnly,
    onToggleActiveOnly,
    onFilterAction,
    onViewUser,
    onDeleteUser,
}: AdminUsersTabProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-5">
            <Card className="glass border-border rounded-2xl overflow-hidden">
                <div className="p-3 sm:p-4 md:p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold">
                            Account Registry
                        </h3>
                        <p className="text-muted-foreground font-medium">
                            Monitor and manage access across the platform
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                        <div className="flex items-center space-x-2">
                            <Badge
                                variant={showActiveOnly ? 'default' : 'outline'}
                                className="cursor-pointer select-none bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                                onClick={onToggleActiveOnly}
                            >
                                Active Only
                            </Badge>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                size={20}
                            />
                            <Input
                                placeholder="Search by ID or email..."
                                className="pl-12 rounded-2xl glass border-border h-11 md:h-14 font-medium w-full"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={onFilterAction}
                            className="h-11 w-full sm:w-11 md:h-14 md:w-14 rounded-2xl bg-card border border-border p-0 text-foreground hover:bg-muted shrink-0"
                        >
                            <Filter size={20} />
                        </Button>
                    </div>
                </div>

                <div className="p-3 sm:p-4 md:p-8 pt-4">
                    <div className="md:hidden space-y-3">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="rounded-2xl border border-border bg-card p-3 space-y-3"
                                    onClick={() => onViewUser(user.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary uppercase shrink-0">
                                            {user.email?.[0] || 'U'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold leading-tight tracking-tight truncate">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-xs truncate text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {user.isVerified ? (
                                            <Badge className="bg-reward/10 text-reward border-none px-2 py-1 font-bold">
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-highlight/10 text-urgent border-none px-2 py-1 font-bold">
                                                Pending
                                            </Badge>
                                        )}
                                        <Badge className="bg-primary/10 text-primary border-none px-2 py-1 font-bold">
                                            {user.streak || 0} Streak
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] text-muted-foreground">
                                            Joined{' '}
                                            {new Date(
                                                user.createdAt || Date.now(),
                                            ).toLocaleDateString('en-GB')}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onViewUser(user.id);
                                            }}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-muted-foreground">
                                No users found
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <Table className="min-w-[760px]">
                            <TableHeader>
                                <TableRow className="border-border hover:bg-transparent text-xs font-bold text-muted-foreground">
                                    <TableHead>User Identification</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Account Status
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Engagement
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell">
                                        Registry Date
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="border-border hover:bg-muted transition-colors py-4 cursor-pointer"
                                            onClick={() => onViewUser(user.id)}
                                        >
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-lg text-primary uppercase shrink-0">
                                                        {user.email?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg leading-tight tracking-tight">
                                                            {user.firstName}{' '}
                                                            {user.lastName}
                                                        </p>
                                                        <p className="text-sm font-medium text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {user.isVerified ? (
                                                    <Badge className="bg-reward/10 text-reward border-none px-3 py-1 font-bold">
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-highlight/10 text-urgent border-none px-3 py-1 font-bold">
                                                        Pending
                                                    </Badge>
                                                )}
                                                {user.lastStudyDate &&
                                                    new Date(user.lastStudyDate) >
                                                        new Date(
                                                            Date.now() -
                                                                7 *
                                                                    24 *
                                                                    60 *
                                                                    60 *
                                                                    1000,
                                                        ) && (
                                                        <Badge className="ml-2 bg-learning-blue/10 text-learning-blue border-none px-3 py-1 font-bold">
                                                            Active
                                                        </Badge>
                                                    )}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold">
                                                        {user.streak || 0}{' '}
                                                        Streak
                                                    </p>
                                                    <div className="w-24 h-1 bg-card rounded-2xl overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{
                                                                width: `${Math.min((user.streak || 0) * 10, 100)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="tabular text-xs hidden lg:table-cell text-muted-foreground">
                                                {new Date(
                                                    user.createdAt || Date.now(),
                                                ).toLocaleDateString('en-GB')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                        onClick={(event) =>
                                                            event.stopPropagation()
                                                        }
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="h-10 w-10 p-0 rounded-2xl hover:bg-muted"
                                                        >
                                                            <MoreVertical
                                                                size={18}
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="glass border-border rounded-2xl p-2 w-48"
                                                    >
                                                        <DropdownMenuItem
                                                            className="rounded-2xl px-4 py-3 font-bold cursor-pointer"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                onViewUser(
                                                                    user.id,
                                                                );
                                                            }}
                                                        >
                                                            View Intelligence
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-2xl px-4 py-3 font-bold text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                                            onClick={(event) =>
                                                                onDeleteUser(
                                                                    user,
                                                                    event,
                                                                )
                                                            }
                                                        >
                                                            Terminate Access
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-20 text-center text-muted-foreground"
                                        >
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>
        </div>
    );
}
