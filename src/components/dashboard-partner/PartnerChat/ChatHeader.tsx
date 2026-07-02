import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PartnerProfile } from '../partnerTypes';
import { getPartnerDisplayName, getPartnerInitial } from '../partnerUtils';

type ChatHeaderProps = {
    partner: PartnerProfile | null;
    onEndPartnership: () => void;
};

export default function ChatHeader({ partner, onEndPartnership }: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-3 p-4 border-b border-foreground/10">
            <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 border border-primary/20">
                    <AvatarImage src={partner?.profilePicturePath} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {getPartnerInitial(partner)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="text-sm font-bold truncate">
                        {getPartnerDisplayName(partner)}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        Accountability Partner
                    </p>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={onEndPartnership}
                        className="text-destructive focus:text-destructive"
                    >
                        End Partnership
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
