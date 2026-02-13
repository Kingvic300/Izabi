'use client';

import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import React from 'react';
import { useMemo } from 'react';
import { getReadableError } from '@/lib/readableErrors';
import { getToastDedupe } from '@/lib/toastDedupe';

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
    return useMemo(
        () => ({
            // Success messages - rewarding and contextual
            success: (options: ToastOptions) => {
                toast.success(options.title || 'Success!', {
                    description: options.description,
                    duration: options.duration ?? 5000,
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            // Error messages - specific and actionable
            error: (options: ToastOptions) => {
                const title = options.title || 'Something went wrong';
                const description =
                    options.description ||
                    'Please try again. If the issue persists, contact support.';
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
                const title = options.title || 'Warning';
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
                toast.info(options.title || 'Info', {
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
                toast.success('Note saved!', {
                    description: 'Your note has been saved successfully.',
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            noteDeleted: () => {
                toast.success('Note deleted', {
                    description: 'Your note has been permanently removed.',
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            profileUpdated: () => {
                toast.success('Profile updated!', {
                    description: 'Your profile changes have been saved.',
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            settingChanged: (settingName: string) => {
                toast.success('Setting updated', {
                    description: `${settingName} has been updated successfully.`,
                    icon: React.createElement(CheckCircle2, {
                        className: 'h-5 w-5 text-green-500',
                    }),
                });
            },

            loginFailed: (reason: string) => {
                const title = 'Login failed';
                const description =
                    reason ||
                    'Please check your email and password and try again.';
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
                const title = 'Signup failed';
                const description =
                    reason || 'Please check your information and try again.';
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
                const title = `Invalid ${fieldName}`;
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
        [],
    );
};
