import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Lock } from 'lucide-react';
import ChangePassword from '@/pages/ChangePassword.tsx';

export default function SecuritySettingsCard() {
    return (
        <Card className="profile-card glass border-foreground/5 rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="px-6 py-4 md:px-8 md:py-6 border-b border-foreground/5">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <Lock className="text-primary" />
                    Security Settings
                </CardTitle>
                <CardDescription>
                    Manage your password and access credentials
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-card/[0.02] border border-foreground/5 hover:bg-card/[0.04] transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <KeyRound size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                Change Password
                            </h3>
                            <p className="text-sm opacity-60">
                                Update your password regularly for better
                                security
                            </p>
                        </div>
                    </div>
                    <ChangePassword />
                </div>
            </CardContent>
        </Card>
    );
}
