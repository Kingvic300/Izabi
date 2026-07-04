'use client';

import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import React from 'react';
import { useMemo } from 'react';
import { getReadableError } from '@/lib/readableErrors';
import { getToastDedupe } from '@/lib/toastDedupe';
import { useLanguage } from '@/contexts/LanguageContext';

export type ToastVariant =
    | 'default'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info';

interface ToastOptions {
    title?: string;
    description?: string;
    duration?: number;
}

export const useAppToast = () => {
    const { t } = useLanguage();

    return useMemo(
        () => ({
            // Success messages - rewarding and contextual
            success: (options: ToastOptions) => {
                toast.success(options.title || t('toast.success_default'), {
                    description: options.description,
                    duration: options.duration ?? 5000,
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            // Error messages - specific and actionable
            error: (options: ToastOptions) => {
                const title = options.title || t('toast.error_default_title');
                const description =
                    options.description || t('toast.error_default_desc');
                const duration = options.duration ?? 5000;
                const { id, suppressed } = getToastDedupe(
                    'error',
                    title,
                    description,
                    duration,
                );
                if (suppressed) return;
                toast.error(title, {
                    id,
                    description,
                    duration,
                    icon: React.createElement(XCircle, {
                        className: 'h-5 w-5 text-red-500',
                    }),
                });
            },

            // Warning messages - explain the risk
            warning: (options: ToastOptions) => {
                const title = options.title || t('toast.warning_default');
                const description = options.description;
                const duration = options.duration ?? 5000;
                const { id, suppressed } = getToastDedupe(
                    'warning',
                    title,
                    description,
                    duration,
                );
                if (suppressed) return;
                toast.warning(title, {
                    id,
                    description,
                    duration,
                    icon: React.createElement(AlertCircle, {
                        className: 'h-5 w-5 text-yellow-500',
                    }),
                });
            },

            // Info messages - helpful guidance
            info: (options: ToastOptions) => {
                toast.info(options.title || t('toast.info_default'), {
                    description: options.description,
                    duration: options.duration ?? 5000,
                    icon: React.createElement(Info, {
                        className: 'h-5 w-5 text-blue-500',
                    }),
                });
            },
            apiError: (error: unknown, fallbackTitle?: string) => {
                const readable = getReadableError(error);
                const title = fallbackTitle || readable.title;
                const description = readable.description;
                const { id, suppressed } = getToastDedupe(
                    'error',
                    title,
                    description,
                    5000,
                );
                if (suppressed) return;
                toast.error(title, {
                    id,
                    description,
                    duration: 5000,
                    icon: React.createElement(XCircle, {
                        className: 'h-5 w-5 text-red-500',
                    }),
                });
            },

            // Specific action messages
            noteSaved: () => {
                toast.success(t('toast.note_saved_title'), {
                    description: t('toast.note_saved_desc'),
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            noteDeleted: () => {
                toast.success(t('toast.note_deleted_title'), {
                    description: t('toast.note_deleted_desc'),
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            profileUpdated: () => {
                toast.success(t('toast.profile_updated_title'), {
                    description: t('toast.profile_updated_desc'),
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            settingChanged: (settingName: string) => {
                toast.success(t('toast.setting_updated_title'), {
                    description: `${settingName} ${t('toast.setting_updated_desc_suffix')}`,
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            loginFailed: (reason: string) => {
                const title = t('toast.login_failed_title');
                const description =
                    reason || t('toast.login_failed_default_desc');
                const { id, suppressed } = getToastDedupe(
                    'error',
                    title,
                    description,
                    5000,
                );
                if (suppressed) return;
                toast.error(title, {
                    id,
                    description,
                    icon: React.createElement(XCircle, {
                        className: 'h-5 w-5 text-red-500',
                    }),
                });
            },

            signupFailed: (reason: string) => {
                const title = t('toast.signup_failed_title');
                const description =
                    reason || t('toast.signup_failed_default_desc');
                const { id, suppressed } = getToastDedupe(
                    'error',
                    title,
                    description,
                    5000,
                );
                if (suppressed) return;
                toast.error(title, {
                    id,
                    description,
                    icon: React.createElement(XCircle, {
                        className: 'h-5 w-5 text-red-500',
                    }),
                });
            },

            networkError: () => {
                const readable = getReadableError({ message: 'Network Error' });
                const { id, suppressed } = getToastDedupe(
                    'error',
                    readable.title,
                    readable.description,
                    5000,
                );
                if (suppressed) return;
                toast.error(readable.title, {
                    id,
                    description: readable.description,
                    duration: 5000,
                    icon: React.createElement(XCircle, {
                        className: 'h-5 w-5 text-red-500',
                    }),
                });
            },

            validationError: (fieldName: string, reason: string) => {
                const title = `${t('toast.invalid_prefix')} ${fieldName}`;
                const description = reason;
                const { id, suppressed } = getToastDedupe(
                    'error',
                    title,
                    description,
                    5000,
                );
                if (suppressed) return;
                toast.error(title, {
                    id,
                    description,
                    icon: React.createElement(XCircle, {
                        className: 'h-5 w-5 text-red-500',
                    }),
                });
            },
        }),
        [t],
    );
};
