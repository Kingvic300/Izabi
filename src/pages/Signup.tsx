'use client';

import type React from 'react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2, Eye, EyeOff } from 'lucide-react';
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
import { useLanguage } from '@/contexts/LanguageContext';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const Signup = () => {
    const normalizeRole = (role?: string) =>
        role?.trim().toUpperCase() || 'USER';
    const getDefaultAvatar = (mail: string) =>
        `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(mail || 'scholar@izabi.ai')}`;
    const { t } = useLanguage();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedPlan = queryParams.get('plan');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const appToast = useAppToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Real-time validation
        if (name === 'email' && value) {
            const validation = formValidation.email(value);
            setErrors((prev) => ({
                ...prev,
                email: validation.error || '',
            }));
        } else if (name === 'password' && value) {
            const validation = formValidation.password(value);
            setErrors((prev) => ({
                ...prev,
                password: validation.error || '',
            }));
        } else if (name === 'confirmPassword' && value && formData.password) {
            const validation = formValidation.passwordMatch(
                formData.password,
                value,
            );
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validation.error || '',
            }));
        }
    };

    /*
     * How: Validates all form inputs and sends an OTP verification request to the backend.
     * Why: Users must verify their email before completing registration to prevent spam and ensure account security.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailValidation = formValidation.email(formData.email);
        const passwordValidation = formValidation.password(formData.password);
        const matchValidation = formValidation.passwordMatch(
            formData.password,
            formData.confirmPassword,
        );

        const newErrors: Record<string, string> = {};
        if (!emailValidation.isValid)
            newErrors.email = emailValidation.error || '';
        if (!passwordValidation.isValid)
            newErrors.password = passwordValidation.error || '';
        if (!matchValidation.isValid)
            newErrors.confirmPassword = matchValidation.error || '';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            appToast.error({
                title: t('signup.toast_validation_error_title'),
                description: t('signup.toast_validation_error_desc'),
            });
            return;
        }

        setIsLoading(true);
        try {
            const normalizedEmail = formData.email.toLowerCase();
            await axios.post(`${BASE_URL}/api/user/send-verification-otp`, {
                email: normalizedEmail,
                password: formData.password,
                role: 'USER',
                firstName: formData.firstName,
                lastName: formData.lastName,
            });

            // Preserve email in case the OTP page is refreshed.
            localStorage.setItem('pendingOtpEmail', normalizedEmail);

            appToast.success({
                title: t('signup.toast_otp_sent_title'),
                description: t('signup.toast_otp_sent_desc'),
            });

            navigate('/otp', {
                state: {
                    email: normalizedEmail,
                    mode: 'verification',
                },
            });
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                t('signup.toast_otp_send_failed_fallback');

            if (err.response?.status === 409) {
                appToast.error({
                    title: t('signup.toast_account_exists_title'),
                    description: t('signup.toast_account_exists_desc'),
                });
            } else if (!navigator.onLine) {
                appToast.networkError();
            } else {
                appToast.error({
                    title: t('signup.toast_registration_failed_title'),
                    description: errorMessage,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
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
                title: t('signup.toast_google_success_title'),
                description: isAdmin
                    ? t('login.toast_welcome_admin')
                    : t('signup.toast_account_ready'),
            });

            setTimeout(() => navigate(redirectPath), 1000);
        } catch (err: any) {
            const status = err.response?.status;
            let description = t('signup.toast_google_generic_error');

            if (status === 404) {
                description = t('signup.toast_google_service_unavailable');
            } else if (err.response?.data?.message) {
                description = err.response.data.message;
            } else if (!navigator.onLine) {
                description = t('login.toast_check_connection');
            }

            appToast.error({
                title: t('signup.toast_google_failed_title'),
                description,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const passwordToggle = (shown: boolean, toggle: () => void, label: string) => (
        <button
            type="button"
            onClick={toggle}
            aria-label={shown ? `Hide ${label}` : `Show ${label}`}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
        >
            {shown ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
    );

    return (
        <AuthLayout
            title={t('auth.signup')}
            subtitle="Free to start. No card needed."
            aside={
                <div className="max-w-sm">
                    <p className="font-display text-[2rem] leading-tight">
                        By tonight you could have:
                    </p>
                    <ul className="mt-8 space-y-4">
                        {[
                            'A summary of tomorrow’s topic',
                            'Practice questions, marked as you go',
                            'Flashcards for the bus ride home',
                            'Your first day of a study streak',
                        ].map((item) => (
                            <li key={item} className="flex gap-3">
                                <Check className="mt-1 h-4 w-4 shrink-0 text-reward" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            }
        >
            {selectedPlan && (
                <p className="-mt-4 mb-6 text-sm">
                    <span className="text-muted-foreground">Plan: </span>
                    <span className="mark-highlight font-bold capitalize">
                        {selectedPlan.replace(/-scholar$/, '').replace(/-/g, ' ')}
                    </span>
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-2 gap-3">
                    <AuthField id="signup-first-name" label="First name">
                        <Input
                            id="signup-first-name"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className={authInputClass()}
                        />
                    </AuthField>
                    <AuthField id="signup-last-name" label="Last name">
                        <Input
                            id="signup-last-name"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className={authInputClass()}
                        />
                    </AuthField>
                </div>

                <AuthField id="signup-email" label={t('auth.email')} error={errors.email}>
                    <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                        className={authInputClass(!!errors.email)}
                    />
                </AuthField>

                <AuthField
                    id="signup-password"
                    label={t('auth.password')}
                    error={errors.password}
                    hint="At least 6 characters, with a capital letter and a number."
                >
                    <div className="relative">
                        <Input
                            id="signup-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            aria-invalid={!!errors.password}
                            className={authInputClass(!!errors.password) + ' pr-12'}
                        />
                        {passwordToggle(showPassword, () => setShowPassword(!showPassword), 'password')}
                    </div>
                </AuthField>

                <AuthField
                    id="signup-confirm-password"
                    label="Confirm password"
                    error={errors.confirmPassword}
                >
                    <div className="relative">
                        <Input
                            id="signup-confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            aria-invalid={!!errors.confirmPassword}
                            className={authInputClass(!!errors.confirmPassword) + ' pr-12'}
                        />
                        {passwordToggle(
                            showConfirmPassword,
                            () => setShowConfirmPassword(!showConfirmPassword),
                            'confirmed password',
                        )}
                    </div>
                </AuthField>

                <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        'Create account'
                    )}
                </Button>
            </form>

            <AuthDivider>or</AuthDivider>

            <div className="flex w-full justify-center">
                <GoogleAuthButton
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        appToast.error({
                            title: t('signup.toast_google_error_title'),
                            description: t('signup.toast_google_error_desc'),
                        });
                    }}
                    label="signup_with"
                />
            </div>

            <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-bold text-foreground underline decoration-sheet decoration-2 underline-offset-4"
                >
                    {t('auth.login')}
                </Link>
            </p>
        </AuthLayout>
    );
};

export default function SignupPage() {
    return (
        <ErrorBoundary>
            <Signup />
        </ErrorBoundary>
    );
}
