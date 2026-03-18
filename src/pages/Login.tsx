'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Mail,
    Lock,
    Sparkles,
    Loader2,
    Eye,
    EyeOff,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import type React from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/constants';
import { useAppToast } from '@/hooks/useAppToast';
import { formValidation } from '@/lib/formValidation';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/contexts/LanguageContext';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const Login = () => {
    const normalizeRole = (role?: string) =>
        role?.trim().toUpperCase() || 'USER';
    const getDefaultAvatar = (mail: string) =>
        `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(mail || 'scholar@izabi.ai')}`;
    const { t } = useLanguage();
    const cardRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const navigate = useNavigate();
    const appToast = useAppToast();
    const [showPassword, setShowPassword] = useState(false);

    useGSAP(() => {
        gsap.from(cardRef.current, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'expo.out',
        });
    });

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (value) {
            const validation = formValidation.email(value);
            setEmailError(validation.error || null);
        } else {
            setEmailError(null);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (value && value.length < 6) {
            setPasswordError('Password must be at least 6 characters');
        } else {
            setPasswordError(null);
        }
    };

    /*
     * How: Validates credentials and sends a login request to the backend. On success, stores tokens and redirects.
     * Why: Authenticates the user and initiates their session.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailValidation = formValidation.email(email);
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.error || null);
            appToast.error({
                title: 'Invalid Email',
                description:
                    emailValidation.error ||
                    'Please check your email formatting.',
            });
            return;
        }

        if (!password) {
            setPasswordError('Password is required');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/api/user/login`,
                { email: email.toLowerCase(), password, role: 'USER' },
                { withCredentials: true },
            );

            const { user, tokens } = response.data;
            const accessToken = tokens.accessToken;
            const userId = user._id || user.id;
            const role = normalizeRole(user.role);

            localStorage.setItem('userId', userId);
            localStorage.setItem('authToken', accessToken);
            if (tokens.refreshToken) {
                localStorage.setItem('refreshToken', tokens.refreshToken);
            }
            localStorage.setItem('userEmail', user.email || email);
            localStorage.setItem('userRole', role);
            if (user.firstName)
                localStorage.setItem('userFirstName', user.firstName);
            if (user.lastName)
                localStorage.setItem('userLastName', user.lastName);
            localStorage.setItem(
                'userProfilePicturePath',
                user.profilePicturePath || getDefaultAvatar(user.email || email),
            );

            // Check if user is admin and redirect accordingly
            const isAdmin = role === 'ADMIN';
            const redirectPath = isAdmin ? '/dashboard/admin' : '/dashboard';

            appToast.success({
                title: 'Login Successful',
                description: isAdmin
                    ? 'Welcome Admin! Redirecting to admin dashboard...'
                    : 'Welcome back! Redirecting to your dashboard...',
            });

            navigate(redirectPath);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed';

            if (err.response?.status === 401) {
                appToast.error({
                    title: 'Login Failed',
                    description: 'Invalid email or password. Please try again.',
                });
            } else if (!navigator.onLine) {
                appToast.networkError();
            } else {
                appToast.error({
                    title: 'Connection Error',
                    description: errorMessage,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/google`, {
                idToken: credentialResponse.credential,
            });

            const { user, tokens } = response.data;
            const accessToken = tokens.accessToken;
            const userId = user._id || user.id;
            const role = normalizeRole(user.role);

            localStorage.setItem('userId', userId);
            localStorage.setItem('authToken', accessToken);
            if (tokens.refreshToken) {
                localStorage.setItem('refreshToken', tokens.refreshToken);
            }
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userRole', role);
            if (user.firstName)
                localStorage.setItem('userFirstName', user.firstName);
            if (user.lastName)
                localStorage.setItem('userLastName', user.lastName);
            localStorage.setItem(
                'userProfilePicturePath',
                user.profilePicturePath || getDefaultAvatar(user.email),
            );

            const isAdmin = role === 'ADMIN';
            const redirectPath = isAdmin ? '/dashboard/admin' : '/dashboard';
            appToast.success({
                title: 'Google Login Successful',
                description: isAdmin
                    ? 'Welcome Admin! Redirecting to admin dashboard...'
                    : 'Welcome! Redirecting to your dashboard...',
            });

            navigate(redirectPath);
        } catch (err: any) {
            const status = err.response?.status;
            let description =
                'Something went wrong during Google authentication.';

            if (status === 404) {
                description =
                    'Authentication service is currently unavailable. Please contact support.';
            } else if (err.response?.data?.message) {
                description = err.response.data.message;
            } else if (!navigator.onLine) {
                description = 'Check your internet connection and try again.';
            }

            appToast.error({
                title: 'Google Sign-In Failed',
                description,
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6">
            <Link
                to="/"
                className="absolute top-4 left-4 sm:top-8 sm:left-8 group z-20"
            >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold opacity-60 group-hover:opacity-100 transition-all text-foreground">
                    <ArrowLeft
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="hidden sm:inline">Return Home</span>
                    <span className="sm:hidden">Back</span>
                </div>
            </Link>

            <div
                ref={cardRef}
                className="w-full max-w-full sm:max-w-[480px] space-y-6 sm:space-y-8 relative z-10 px-1"
            >
                {/* Branding */}
                <div className="text-center space-y-3 sm:space-y-4">
                    <Logo size={200} className="justify-center mx-auto" />
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-foreground">
                            {t('auth.login')}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium px-2">
                            Welcome back! Please sign in to your account.
                        </p>
                    </div>
                </div>

                <Card className="glass shadow-2xl border-foreground/10 rounded-xl sm:rounded-2xl overflow-hidden">
                    <CardContent className="p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 sm:space-y-6"
                        >
                            <div className="space-y-2">
                                <Label
                                    htmlFor="login-email"
                                    className="text-[10px] uppercase font-bold tracking-widest opacity-40 px-1"
                                >
                                    {t('auth.email')}
                                </Label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                                        size={18}
                                    />
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="scholar@example.com"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className={cn(
                                            'h-12 sm:h-14 pl-11 sm:pl-12 rounded-lg sm:rounded-xl bg-card/5 border-foreground/10 focus:border-primary transition-all text-base sm:text-lg font-medium text-foreground',
                                            emailError &&
                                                'border-destructive/50',
                                        )}
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-xs text-destructive font-bold px-1">
                                        {emailError}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between px-1">
                                    <Label
                                        htmlFor="login-password"
                                        className="text-[10px] uppercase font-bold tracking-widest opacity-40"
                                    >
                                        {t('auth.password')}
                                    </Label>
                                </div>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                                        size={18}
                                    />
                                    <Input
                                        id="login-password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={cn(
                                            'h-12 sm:h-14 pl-11 sm:pl-12 pr-11 sm:pr-12 rounded-lg sm:rounded-xl bg-card/5 border-foreground/10 focus:border-primary transition-all text-base sm:text-lg font-medium text-foreground',
                                            passwordError &&
                                                'border-destructive/50',
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="text-xs text-destructive font-bold px-1">
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 sm:h-16 rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg sm:text-xl shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden group"
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="group-hover:rotate-12 transition-transform" />
                                        <span>{t('auth.initialize')}</span>
                                    </>
                                )}
                            </Button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-foreground/5"></span>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                    <span className="bg-background px-4 text-muted-foreground/40">
                                        Or continue with Google
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <GoogleAuthButton
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        appToast.error({
                                            title: 'Google Sign-In Error',
                                            description:
                                                'Google sign-in failed. Please try again or use your email and password.',
                                        });
                                    }}
                                    label="Sign in with Google"
                                />
                            </div>
                        </form>

                        <div className="pt-6 border-t border-foreground/5 text-center">
                            <p className="text-xs sm:text-sm font-bold text-muted-foreground">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-primary/50"
                                >
                                    {t('auth.join')}
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default function LoginPage() {
    return (
        <ErrorBoundary>
            <Login />
        </ErrorBoundary>
    );
}
