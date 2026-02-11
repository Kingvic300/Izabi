'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Brain,
    ArrowLeft,
    Sparkles,
    Loader2,
    ShieldCheck,
    Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_URL } from '@/constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Logo } from '@/components/Logo';

// Define types for the error response
interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const OTP = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    useGSAP(() => {
        gsap.from(cardRef.current, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'expo.out',
        });
    });

    // Determine mode from route query or state: "verification" | "reset"
    const mode = location.state?.mode || 'verification';
    const email = (location.state?.email || '').toLowerCase();
    const password = location.state?.password || '';

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text')
            .slice(0, 6)
            .split('');
        const newOtp = [...otp];

        pastedData.forEach((char, index) => {
            if (/^[0-9]$/.test(char)) {
                newOtp[index] = char;
            }
        });

        setOtp(newOtp);

        // Focus the last filled input or the next empty one
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    /*
     * How: Submits the 6-digit OTP code to the backend for verification. On success, completes registration and redirects to login.
     * Why: Confirms the user has access to the email address provided during signup.
     */
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length < 6) {
            toast.error('Incomplete Code', {
                description:
                    'Please enter the full 6-digit verification code sent to your email.',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/api/user/register`, {
                email: location.state?.email?.toLowerCase(),
                otp: otpCode,
                role: 'USER',
            });

            const { user, tokens } = response.data;
            const accessToken = tokens.accessToken;
            const userId = user._id || user.id;
            const role = user.role;
            const userEmail = user.email;

            localStorage.setItem('userId', userId);
            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('userRole', role || 'USER');

            toast.success('Account Verified', {
                description:
                    'Welcome to Izabi! Routing you to your dashboard...',
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            const errorMessage =
                error.response?.data?.message ||
                'The code you entered is invalid or has expired.';
            toast.error('Verification Failed', {
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    /*
     * How: Triggers a new OTP email request based on the current mode (verification or password reset).
     * Why: Allows users to receive a fresh code if the previous one expired or was not received.
     */
    const handleResendOtp = async () => {
        setResending(true);
        try {
            if (mode === 'verification') {
                await axios.post(`${BASE_URL}/api/user/send-verification-otp`, {
                    email,
                    password,
                    role: 'USER',
                });
            } else if (mode === 'reset') {
                await axios.post(`${BASE_URL}/api/user/send-reset-otp`, {
                    email,
                });
            }
            toast.success('Code Resent', {
                description:
                    'A new verification code has been sent to your email.',
            });
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            toast.error('Error', {
                description:
                    error.response?.data?.message ||
                    'Failed to resend verification code. Please try again.',
            });
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6">
            <Link
                to="/signup"
                className="absolute top-4 left-4 sm:top-8 sm:left-8 group z-20"
            >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold opacity-60 group-hover:opacity-100 transition-all">
                    <ArrowLeft
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="hidden sm:inline">Back to Signup</span>
                    <span className="sm:hidden">Back</span>
                </div>
            </Link>

            <div
                ref={cardRef}
                className="w-full max-w-[480px] space-y-6 sm:space-y-8 relative z-10"
            >
                {/* Branding */}
                <div className="text-center space-y-3 sm:space-y-4">
                    <Logo
                        size={48}
                        className="justify-center mx-auto sm:w-16 sm:h-16"
                    />
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-foreground">
                            Email{' '}
                            <span className="text-gradient">Verification</span>
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium px-2">
                            Please enter the security code sent to your email.
                        </p>
                    </div>
                </div>

                <Card className="glass shadow-2xl border-foreground/10 rounded-xl sm:rounded-2xl overflow-hidden">
                    <CardContent className="p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6 md:space-y-8">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-card/5 flex items-center justify-center mb-1 md:mb-2">
                                <Mail className="text-primary h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <p className="text-xs md:text-sm font-bold text-muted-foreground">
                                Code sent to:
                            </p>
                            <p className="text-base md:text-lg font-bold text-foreground px-4 py-1 glass rounded-lg border border-foreground/10 break-all">
                                {email || 'scholar@example.com'}
                            </p>
                        </div>

                        <form
                            onSubmit={handleOtpSubmit}
                            className="space-y-5 sm:space-y-6 md:space-y-8"
                        >
                            <div className="flex justify-between gap-1.5 sm:gap-2 md:gap-3">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) =>
                                            (inputRefs.current[index] = el)
                                        }
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) =>
                                            handleChange(e.target.value, index)
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, index)
                                        }
                                        onPaste={handlePaste}
                                        className="w-9 h-11 sm:w-12 sm:h-14 md:w-14 md:h-16 rounded-lg sm:rounded-xl text-center text-lg sm:text-xl md:text-2xl font-bold bg-card/5 border-foreground/10 focus:border-primary focus:ring-2 sm:focus:ring-4 focus:ring-primary/20 transition-all text-foreground p-0"
                                    />
                                ))}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || otp.join('').length < 6}
                                className="w-full h-14 sm:h-16 rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg sm:text-xl shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden group"
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="group-hover:rotate-12 transition-transform" />
                                        <span>Verify Account</span>
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="pt-6 border-t border-foreground/5 text-center flex flex-col gap-4">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={resending}
                                className="text-xs uppercase font-bold tracking-widest text-primary hover:opacity-80 transition-opacity disabled:opacity-40"
                            >
                                {resending
                                    ? 'Sending code...'
                                    : 'Resend Verification Code'}
                            </button>
                            <p className="text-xs font-bold text-muted-foreground">
                                Wrong email?{' '}
                                <Link
                                    to="/signup"
                                    className="text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-primary/50"
                                >
                                    Change email address
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OTP;
