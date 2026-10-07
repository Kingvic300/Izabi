'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/constants';
import { useAppToast } from '@/hooks/useAppToast';
import { formValidation } from '@/lib/formValidation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
    AuthDivider,
    AuthField,
    AuthLayout,
    authInputClass,
} from '@/components/auth/AuthLayout';
import { Bubble } from '@/components/ui/bubble';
import { useLanguage } from '@/contexts/LanguageContext';
import ChangePassword from '@/pages/ChangePassword';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const Login = () => {
    const normalizeRole = (role?: string) =>
        role?.trim().toUpperCase() || 'USER';
    const getDefaultAvatar = (mail: string) =>
        `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(mail || 'scholar@izabi.ai')}`;
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const navigate = useNavigate();
    const appToast = useAppToast();
    const [showPassword, setShowPassword] = useState(false);

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
                title: t('login.toast_invalid_email_title'),
                description:
                    emailValidation.error ||
                    t('login.toast_invalid_email_fallback'),
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
                title: t('login.toast_success_title'),
                description: isAdmin
                    ? t('login.toast_welcome_admin')
                    : t('login.toast_welcome_back'),
            });

            navigate(redirectPath);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || t('login.toast_generic_failed');

            if (err.response?.status === 401) {
                appToast.error({
                    title: t('login.toast_failed_title'),
                    description: t('login.toast_invalid_credentials'),
                });
            } else if (!navigator.onLine) {
                appToast.networkError();
            } else {
                appToast.error({
                    title: t('login.toast_connection_error_title'),
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
                title: t('login.toast_google_success_title'),
                description: isAdmin
                    ? t('login.toast_welcome_admin')
                    : t('login.toast_welcome_google'),
            });

            navigate(redirectPath);
        } catch (err: any) {
            const status = err.response?.status;
            let description = t('login.toast_google_generic_error');

            if (status === 404) {
                description = t('login.toast_google_service_unavailable');
            } else if (err.response?.data?.message) {
                description = err.response.data.message;
            } else if (!navigator.onLine) {
                description = t('login.toast_check_connection');
            }

            appToast.error({
                title: t('login.toast_google_failed_title'),
                description,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={t('auth.login')}
            subtitle="Pick up where you left off."
            aside={
                <div className="max-w-sm">
                    <p className="font-display text-[2rem] leading-tight">
                        Your streak is waiting.
                    </p>
                    <div className="mt-8 flex gap-2.5" aria-hidden>
                        {[1, 1, 1, 1, 1, 1, 0].map((done, i) => (
                            <Bubble
                                key={i}
                                state={done ? 'filled' : 'empty'}
                                size="md"
                                className={
                                    i === 6
                                        ? 'ring-2 ring-highlight ring-offset-2 ring-offset-card'
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                    <p className="mt-6 text-muted-foreground">
                        Log in to answer today’s Brain Drop and keep your run
                        going. Your notes, quizzes and chats are where you left
                        them.
                    </p>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <AuthField id="login-email" label={t('auth.email')} error={emailError}>
                    <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={handleEmailChange}
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? 'login-email-error' : undefined}
                        className={authInputClass(!!emailError)}
                    />
                </AuthField>

                <AuthField
                    id="login-password"
                    label={t('auth.password')}
                    error={passwordError}
                    action={
                        <ChangePassword
                            initialEmail={email}
                            trigger={
                                <button
                                    type="button"
                                    className="text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-foreground"
                                >
                                    {t('auth.forgot_password')}
                                </button>
                            }
                        />
                    }
                >
                    <div className="relative">
                        <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={password}
                            onChange={handlePasswordChange}
                            aria-invalid={!!passwordError}
                            aria-describedby={passwordError ? 'login-password-error' : undefined}
                            className={authInputClass(!!passwordError) + ' pr-12'}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </AuthField>

                <Button type="submit" disabled={loading} size="lg" className="w-full">
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        t('auth.initialize')
                    )}
                </Button>
            </form>

            <AuthDivider>or</AuthDivider>

            <div className="flex w-full justify-center">
                <GoogleAuthButton
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        appToast.error({
                            title: t('login.toast_google_error_title'),
                            description: t('login.toast_google_error_desc'),
                        });
                    }}
                    label="signin_with"
                />
            </div>

            <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
                New to Izabi?{' '}
                <Link
                    to="/signup"
                    className="font-bold text-foreground underline decoration-sheet decoration-2 underline-offset-4"
                >
                    {t('auth.join')}
                </Link>
            </p>
        </AuthLayout>
    );
};

export default function LoginPage() {
    return (
        <ErrorBoundary>
            <Login />
        </ErrorBoundary>
    );
}
