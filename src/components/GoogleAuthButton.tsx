'use client';

import React from 'react';
import {
    GoogleLogin,
    type CredentialResponse,
} from '@react-oauth/google';
import { cn } from '@/lib/utils';

interface GoogleAuthButtonProps {
    onSuccess: (credentialResponse: CredentialResponse) => void;
    onError: () => void;
    label?: string;
    useOneTap?: boolean;
    className?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
    onSuccess,
    onError,
    label = 'Continue with Google',
    useOneTap = false,
    className,
}) => {
    return (
        <div className={cn('relative group w-full', className)}>
            <div className="pointer-events-none w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-card/50 border border-foreground/10 shadow-2xl flex items-center justify-center gap-3 px-4 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-glow group-hover:bg-card/70">
                <span className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 48 48"
                        className="h-4 w-4"
                    >
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.66 1.22 9.14 3.6l6.8-6.8C35.94 2.3 30.4 0 24 0 14.62 0 6.5 5.38 2.56 13.22l7.9 6.14C12.3 13.06 17.7 9.5 24 9.5z"
                        />
                        <path
                            fill="#4285F4"
                            d="M46.1 24.5c0-1.7-.15-2.9-.48-4.16H24v7.9h12.5c-.26 2.1-1.66 5.26-4.76 7.38l7.32 5.68C43.38 37.2 46.1 31.5 46.1 24.5z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M10.46 28.86a13.9 13.9 0 0 1-.72-4.36c0-1.52.26-2.98.7-4.36l-7.9-6.14A23.98 23.98 0 0 0 0 24.5c0 3.88.93 7.55 2.56 10.78l7.9-6.42z"
                        />
                        <path
                            fill="#34A853"
                            d="M24 48c6.4 0 11.78-2.12 15.7-5.78l-7.32-5.68c-1.98 1.38-4.6 2.34-8.38 2.34-6.3 0-11.7-3.56-13.52-8.86l-7.9 6.42C6.5 42.62 14.62 48 24 48z"
                        />
                    </svg>
                </span>
                <span className="text-sm sm:text-base font-bold tracking-tight text-foreground">
                    {label}
                </span>
            </div>
            <div className="absolute inset-0 opacity-0 [&_div]:w-full [&_div]:h-full [&_iframe]:w-full [&_iframe]:h-full">
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onError}
                    useOneTap={useOneTap}
                    theme="outline"
                    size="large"
                    shape="pill"
                    width="100%"
                />
            </div>
        </div>
    );
};

export default GoogleAuthButton;
