import type React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

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
        <section className="rounded-lg border border-border bg-card p-6 sm:p-8">
            <h3 className="text-2xl">Invite a study partner</h3>
            <p className="mt-2 max-w-xl text-muted-foreground">
                Enter a friend’s email. When they accept, you set a goal
                together, see each other’s streaks and can message each other.
            </p>
            <form
                onSubmit={handleSubmit}
                className="mt-6 flex max-w-lg flex-col gap-2 sm:flex-row"
            >
                <Input
                    type="email"
                    autoComplete="email"
                    placeholder="friend@example.com"
                    aria-label="Partner's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-11 flex-1"
                    required
                />
                <Button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className="h-11"
                >
                    {isLoading ? <Loader className="animate-spin" /> : 'Send invite'}
                </Button>
            </form>
        </section>
    );
}
