import type React from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Handshake, Loader, Mail } from 'lucide-react';

type NoPartnerStateProps = {
    onInvite: (email: string) => Promise<boolean>;
    isLoading: boolean;
};

export default function NoPartnerState({
    onInvite,
    isLoading,
}: NoPartnerStateProps) {
    const [email, setEmail] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!email.trim()) return;
        const sent = await onInvite(email.trim());
        if (sent) setEmail('');
    };

    return (
        <Card className="glass-card border-foreground/10 rounded-[28px]">
            <CardContent className="p-6 sm:p-10 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Handshake className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">
                        Find an Accountability Partner
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Invite a friend or fellow scholar by email. Once they
                        accept, you'll set a shared goal, track streaks
                        together, and keep each other on track.
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="email"
                            placeholder="partner@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="pl-9"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading || !email.trim()}>
                        {isLoading ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            'Send Invite'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
