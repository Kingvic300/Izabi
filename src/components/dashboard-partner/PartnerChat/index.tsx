import { Card } from '@/components/ui/card';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import type { PartnerMessage, PartnerProfile } from '../partnerTypes';

type PartnerChatProps = {
    partner: PartnerProfile | null;
    messages: PartnerMessage[];
    currentUserId: string;
    onSend: (content: string, type: 'message' | 'nudge') => Promise<void>;
    onEndPartnership: () => void;
};

export default function PartnerChat({
    partner,
    messages,
    currentUserId,
    onSend,
    onEndPartnership,
}: PartnerChatProps) {
    return (
        <Card className="glass-card border-foreground/10 rounded-[28px] overflow-hidden flex flex-col h-[500px]">
            <ChatHeader partner={partner} onEndPartnership={onEndPartnership} />
            <ChatMessages messages={messages} currentUserId={currentUserId} />
            <ChatInput onSend={onSend} />
        </Card>
    );
}
