'use client';

import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import React from 'react';

export type ToastVariant =
    | 'default'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info';

interface ToastOptions {
    title?: string;
    description: string;
    duration?: number;
}

export const useAppToast = () => {
    return {
        // Success messages - rewarding and contextual
        success: (options: ToastOptions) => {
            toast.success(options.title || 'Success!', {
                description: options.description,
                duration: options.duration,
                icon: React.createElement(CheckCircle2, {
                    className: 'h-5 w-5 text-green-500',
                }),
            });
        },

        // Error messages - specific and actionable
        error: (options: ToastOptions) => {
            toast.error(options.title || 'Something went wrong', {
                description: options.description,
                duration: options.duration,
                icon: React.createElement(XCircle, {
                    className: 'h-5 w-5 text-red-500',
                }),
            });
        },

        // Warning messages - explain the risk
        warning: (options: ToastOptions) => {
            toast.warning(options.title || 'Warning', {
                description: options.description,
                duration: options.duration,
                icon: React.createElement(AlertCircle, {
                    className: 'h-5 w-5 text-yellow-500',
                }),
            });
        },

        // Info messages - helpful guidance
        info: (options: ToastOptions) => {
            toast.info(options.title || 'Info', {
                description: options.description,
                duration: options.duration,
                icon: React.createElement(Info, {
                    className: 'h-5 w-5 text-blue-500',
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
            toast.error('Login failed', {
                description:
                    reason ||
                    'Please check your email and password and try again.',
                icon: React.createElement(XCircle, {
                    className: 'h-5 w-5 text-red-500',
                }),
            });
        },

        signupFailed: (reason: string) => {
            toast.error('Signup failed', {
                description:
                    reason || 'Please check your information and try again.',
                icon: React.createElement(XCircle, {
                    className: 'h-5 w-5 text-red-500',
                }),
            });
        },

        networkError: () => {
            toast.error('Connection lost', {
                description:
                    'Please check your internet connection and try again.',
                icon: React.createElement(XCircle, {
                    className: 'h-5 w-5 text-red-500',
                }),
            });
        },

        validationError: (fieldName: string, reason: string) => {
            toast.error(`Invalid ${fieldName}`, {
                description: reason,
                icon: React.createElement(XCircle, {
                    className: 'h-5 w-5 text-red-500',
                }),
            });
        },
    };
};
