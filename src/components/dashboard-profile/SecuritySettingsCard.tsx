import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChangePassword from '@/pages/ChangePassword.tsx';

export default function SecuritySettingsCard() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b border-border px-6 py-4">
                <CardTitle className="text-xl">Password</CardTitle>
                <CardDescription>
                    We email you a code to confirm the change.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground">
                    Forgotten it, or want a new one?
                </p>
                <ChangePassword />
            </CardContent>
        </Card>
    );
}
