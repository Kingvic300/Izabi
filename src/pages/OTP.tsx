'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getToastDedupe } from '@/lib/toastDedupe';
import axios from 'axios';
import { BASE_URL } from '@/constants';
import { AuthLayout } from '@/components/auth/AuthLayout';

// Define types for the error response
interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

const OTP = () => {
    const normalizeRole = (role?: string) =>
        role?.trim().toUpperCase() || 'USER';
    const getDefaultAvatar = (mail: string) =>
        `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(mail || 'scholar@izabi.ai')}`;
    const showErrorToast = (title: string, description: string) => {
        const { id, suppressed } = getToastDedupe(
            'error',
            title,
            description,
            5000,
        );
        if (suppressed) return;
        toast.error(title, { id, description });
    };
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine mode from route query or state: "verification" | "reset"
    const mode = location.state?.mode || 'verification';
    const persistedEmail = localStorage.getItem('pendingOtpEmail') || '';
    const email = (location.state?.email || persistedEmail).toLowerCase();

    useEffect(() => {
        if (email) {
            localStorage.setItem('pendingOtpEmail', email);
        }
    }, [email]);

    useEffect(() => {
        if (resendCountdown <= 0) return;

        const timer = window.setInterval(() => {
            setResendCountdown((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [resendCountdown]);

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus();
    };

    const updateOtpDigits = (
        digits: string[],
        startIndex: number,
        clearCurrent = false,
    ) => {
        setOtp((prev) => {
            const next = [...prev];
            if (clearCurrent) {
                next[startIndex] = '';
            }
            digits.forEach((digit, offset) => {
                const targetIndex = startIndex + offset;
                if (targetIndex < OTP_LENGTH) {
                    next[targetIndex] = digit;
                }
            });
            return next;
        });
    };

    const handleChange = (value: string, index: number) => {
        const digits = value.replace(/\D/g, '');

        if (!digits) {
            updateOtpDigits([], index, true);
            return;
        }

        const chars = digits.slice(0, OTP_LENGTH - index).split('');
        updateOtpDigits(chars, index);

        const nextFocusIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
        focusInput(nextFocusIndex);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            focusInput(index - 1);
            return;
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            focusInput(index - 1);
            return;
        }

        if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
            e.preventDefault();
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent, index: number) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '');
        if (!digits) return;

        const chars = digits.slice(0, OTP_LENGTH - index).split('');
        updateOtpDigits(chars, index);
        const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
        focusInput(nextIndex);
    };

    /*
     * How: Submits the 6-digit OTP code to the backend for verification. On success, completes registration and redirects to login.
     * Why: Confirms the user has access to the email address provided during signup.
     */
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (!email) {
            showErrorToast(
                'Missing Email',
                'Your verification session expired. Please go back to signup and request a new code.',
            );
            return;
        }

        if (otpCode.length < OTP_LENGTH) {
            showErrorToast(
                'Incomplete Code',
                'Please enter the full 6-digit verification code sent to your email.',
            );
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/api/user/register`, {
                email,
                otp: otpCode,
                role: 'USER',
            });

            const { user, tokens } = response.data;
            const accessToken = tokens.accessToken;
            const userId = user._id || user.id;
            const role = normalizeRole(user.role);
            const userEmail = user.email;

            localStorage.setItem('userId', userId);
            localStorage.setItem('authToken', accessToken);
            if (tokens.refreshToken) {
                localStorage.setItem('refreshToken', tokens.refreshToken);
            }
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('userRole', role);
            localStorage.setItem(
                'userProfilePicturePath',
                user.profilePicturePath || getDefaultAvatar(userEmail),
            );

            toast.success('Account Verified', {
                description:
                    'Welcome to Izabi! Routing you to your dashboard...',
            });
            localStorage.removeItem('pendingOtpEmail');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            const errorMessage =
                error.response?.data?.message ||
                'The code you entered is invalid or has expired.';
            showErrorToast('Verification Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /*
     * How: Triggers a new OTP email request based on the current mode (verification or password reset).
     * Why: Allows users to receive a fresh code if the previous one expired or was not received.
     */
    const handleResendOtp = async () => {
        if (!email) {
            showErrorToast(
                'Missing Email',
                'Please return to signup and request a new verification code.',
            );
            return;
        }

        if (resendCountdown > 0) {
            return;
        }

        setResending(true);
        try {
            if (mode === 'verification') {
                await axios.post(
                    `${BASE_URL}/api/user/send-verification-otp`,
                    {
                        email,
                        role: 'USER',
                    },
                );
            } else if (mode === 'reset') {
                await axios.post(`${BASE_URL}/api/user/send-reset-otp`, {
                    email,
                });
            }
            setOtp(Array(OTP_LENGTH).fill(''));
            focusInput(0);
            setResendCountdown(RESEND_COOLDOWN_SECONDS);
            toast.success('Code Resent', {
                description:
                    'A new verification code has been sent to your email.',
            });
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            showErrorToast(
                'Error',
                error.response?.data?.message ||
                    'Failed to resend verification code. Please try again.',
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthLayout
            title="Check your email"
            subtitle={
                <>
                    Enter the 6-digit code we sent to{' '}
                    <span className="break-all font-bold text-foreground">
                        {email || 'your email'}
                    </span>
                    .
                </>
            }
            backTo="/signup"
            backLabel="Sign up"
        >
            <form onSubmit={handleOtpSubmit} className="space-y-6">
                <fieldset>
                    <legend className="sr-only">Verification code</legend>
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                aria-label={`Digit ${index + 1}`}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={(e) => handlePaste(e, index)}
                                onFocus={(e) => e.currentTarget.select()}
                                autoFocus={index === 0}
                                className="tabular h-14 w-full max-w-[3.5rem] rounded-[4px] border-sheet/50 p-0 text-center font-display text-2xl focus-visible:border-foreground sm:h-16"
                            />
                        ))}
                    </div>
                </fieldset>

                <Button
                    type="submit"
                    disabled={loading || otp.join('').length < 6}
                    size="lg"
                    className="w-full"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        'Verify email'
                    )}
                </Button>
            </form>

            <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
                <p>
                    No code?{' '}
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resending || resendCountdown > 0}
                        className="tabular font-bold text-foreground underline decoration-sheet decoration-2 underline-offset-4 disabled:font-normal disabled:text-muted-foreground disabled:no-underline"
                    >
                        {resending
                            ? 'Sending…'
                            : resendCountdown > 0
                              ? `Send again in ${resendCountdown}s`
                              : 'Send a new code'}
                    </button>
                </p>
                <p>
                    Wrong email?{' '}
                    <Link
                        to="/signup"
                        className="font-bold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                    >
                        Change it
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default OTP;
