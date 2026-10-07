import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useAppToast } from '@/hooks/useAppToast';
import { useLanguage } from '@/contexts/LanguageContext';
import apiClient from '@/lib/apiClient';
import { Lock, Loader2 } from 'lucide-react';

interface ChangePasswordProps {
    trigger?: ReactNode;
    initialEmail?: string;
}

const ChangePassword = ({ trigger, initialEmail }: ChangePasswordProps) => {
    const appToast = useAppToast();
    const { t } = useLanguage();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState(initialEmail || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    /*
     * How: Initiates the password recovery process by requesting an OTP from the backend to the user's email.
     * Why: Verifies that the user owns the email address before allowing password modification.
     */
    const sendOtp = async () => {
        if (!email) {
            appToast.error({
                title: t('change_password.toast_email_required_title'),
                description: t('change_password.toast_email_required_desc'),
            });
            return;
        }
        setLoading(true);
        try {
            await apiClient.post(`/api/user/forgot-password`, { email });

            appToast.success({
                title: t('change_password.toast_code_sent_title'),
                description: t('change_password.toast_code_sent_desc'),
            });
            setStep(2);
        } catch (err) {
            // handled by interceptor or generic
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /*
     * How: Validates the OTP and new password, then sends a request to update the user's password.
     * Why: securely finalizes the password change process ensuring only authorized users can reset credentials.
     */
    const resetPassword = async () => {
        if (!otp || !newPassword) {
            appToast.error({
                title: t('change_password.toast_missing_fields_title'),
                description: t('change_password.toast_missing_fields_desc'),
            });
            return;
        }
        setLoading(true);
        try {
            await apiClient.post(`/api/user/reset-password`, {
                email,
                otp,
                newPassword,
            });

            appToast.success({
                title: t('change_password.toast_security_updated_title'),
                description: t('change_password.toast_security_updated_desc'),
            });
            setOpen(false);
            setStep(1);
            setEmail('');
            setOtp('');
            setNewPassword('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline">
                        <Lock className="h-4 w-4" />
                        {t('change_password.reset_access')}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-2 text-left">
                    <p className="text-sm text-muted-foreground">
                        Step {step} of 2
                    </p>
                    <DialogTitle className="text-2xl">
                        {step === 1
                            ? t('change_password.verify_identity')
                            : t('change_password.set_new_password')}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        {step === 1
                            ? t('change_password.step1_desc')
                            : t('change_password.step2_desc')}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-5 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="reset-email" className="text-sm font-bold">
                                {t('change_password.your_email')}
                            </Label>
                            <Input
                                id="reset-email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="h-12 text-base"
                            />
                        </div>
                        <Button onClick={sendOtp} disabled={loading} size="lg" className="w-full">
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                t('change_password.send_code')
                            )}
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="reset-otp" className="text-sm font-bold">
                                {t('change_password.verification_code')}
                            </Label>
                            <Input
                                id="reset-otp"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="tabular h-12 text-center font-display text-xl"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="reset-new-password" className="text-sm font-bold">
                                {t('change_password.new_password')}
                            </Label>
                            <Input
                                id="reset-new-password"
                                type="password"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-12 text-base"
                            />
                        </div>
                        <Button onClick={resetPassword} disabled={loading} size="lg" className="w-full">
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                t('change_password.confirm_update')
                            )}
                        </Button>
                        <Button variant="link" onClick={() => setStep(1)} className="w-full">
                            {t('change_password.back_to_email')}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ChangePassword;
