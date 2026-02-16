'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, History, XCircle } from 'lucide-react';
import type { ChatSession } from './types';

type ChatHistorySheetProps = {
    chatSessions: ChatSession[];
    activeSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
    onClearHistory: () => void;
};

export default function ChatHistorySheet({
    chatSessions,
    activeSessionId,
    onSelectSession,
    onClearHistory,
}: ChatHistorySheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 glass-card font-bold hover:bg-card/5"
                >
                    <History className="h-3 w-3" />
                    <span className="hidden sm:inline">History</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-[92vw] max-w-[380px] sm:max-w-[420px] bg-card border-foreground/10 p-0 flex flex-col"
            >
                <SheetHeader className="p-6 pb-4">
                    <SheetTitle className="text-2xl font-bold flex items-center gap-3">
                        <History className="text-primary" />
                        <span>Chat History</span>
                    </SheetTitle>
                    <SheetDescription className="font-medium opacity-60">
                        Browse your past interactions with Izabi.
                    </SheetDescription>
                </SheetHeader>
                <Separator className="bg-card/5" />
                <ScrollArea className="flex-1 px-4 py-6">
                    <div className="space-y-3">
                        {chatSessions.length === 0 ? (
                            <div className="text-center py-20 opacity-40">
                                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-widest">
                                    No history recorded yet
                                </p>
                            </div>
                        ) : (
                            chatSessions.map((session) => {
                                const timestamp = new Date(
                                    session.updatedAt ||
                                        session.createdAt ||
                                        Date.now(),
                                ).toLocaleString([], {
                                    month: 'short',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                                return (
                                    <Button
                                        key={session.sessionId}
                                        variant="ghost"
                                        onClick={() =>
                                            onSelectSession(session.sessionId)
                                        }
                                        className={`w-full justify-start h-auto py-3 px-4 rounded-xl transition-all border ${
                                            session.sessionId ===
                                            activeSessionId
                                                ? 'bg-primary/10 border-primary/30'
                                                : 'hover:bg-primary/10 border-transparent'
                                        }`}
                                    >
                                        <div className="flex flex-col items-start gap-0.5 overflow-hidden flex-1">
                                            <span className="text-[10px] font-bold text-foreground/80 line-clamp-1 text-left">
                                                {session.title ||
                                                    'Chat session'}
                                            </span>
                                            {session.lastMessage?.content ? (
                                                <span className="text-[11px] opacity-60 line-clamp-1 text-left">
                                                    {session.lastMessage.content}
                                                </span>
                                            ) : null}
                                            <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest">
                                                {timestamp}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                                            {(session.promptCount ?? 0) + '/100'}
                                        </span>
                                    </Button>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
                <div className="p-6 border-t border-foreground/5">
                    <Button
                        variant="destructive"
                        onClick={onClearHistory}
                        className="w-full rounded-xl font-bold gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-foreground transition-all"
                    >
                        <XCircle size={16} />
                        Clear All History
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
