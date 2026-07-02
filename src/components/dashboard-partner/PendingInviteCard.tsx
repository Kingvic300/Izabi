import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import type { Partnership } from './partnerTypes';
import { getPartnerDisplayName, getPartnerInitial } from './partnerUtils';

type PendingInviteCardProps = {
    partnership: Partnership;
    onRespond: (accept: boolean) => Promise<void>;
    isLoading: boolean;
};

export default function PendingInviteCard({
    partnership,
    onRespond,
    isLoading,
}: PendingInviteCardProps) {
    const name = getPartnerDisplayName(partnership.partner);

    return (
        <Card className="glass-card border-primary/30 rounded-[28px]">
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <Avatar className="h-16 w-16 border border-primary/20">
                    <AvatarImage src={partnership.partner?.profilePicturePath} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                        {getPartnerInitial(partnership.partner)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-bold">
                        {name} wants to be your Accountability Partner
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Accept to start setting shared goals and tracking
                        streaks together.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button
                        variant="outline"
                        onClick={() => onRespond(false)}
                        disabled={isLoading}
                    >
                        Decline
                    </Button>
                    <Button onClick={() => onRespond(true)} disabled={isLoading}>
                        {isLoading ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            'Accept'
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
