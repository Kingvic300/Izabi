'use client';

import React from 'react';
import {
    GoogleLogin,
    type CredentialResponse,
    type PromptMomentNotification,
} from '@react-oauth/google';

interface GoogleAuthButtonProps {
    onSuccess: (credentialResponse: CredentialResponse) => void;
    onError: () => void;
    label?: 'signin_with' | 'signup_with';
    useOneTap?: boolean;
    className?: string;
}

const handlePromptMoment = (notification: PromptMomentNotification) => {
    if (notification.isNotDisplayed()) {
        console.warn(
            '[GoogleAuth] Prompt not displayed:',
            notification.getNotDisplayedReason(),
        );
    } else if (notification.isSkippedMoment()) {
        console.warn(
            '[GoogleAuth] Prompt skipped:',
            notification.getSkippedReason(),
        );
    }
};

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
    onSuccess,
    onError,
    label = 'signin_with',
    useOneTap = false,
    className,
}) => {
    return (
        <div className={className}>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    if (!credentialResponse.credential) {
                        onError();
                        return;
                    }
                    onSuccess(credentialResponse);
                }}
                onError={onError}
                promptMomentNotification={handlePromptMoment}
                useOneTap={useOneTap}
                use_fedcm_for_prompt
                use_fedcm_for_button
                theme="filled_black"
                size="large"
                shape="pill"
                text={label}
                width="360"
            />
        </div>
    );
};

export default GoogleAuthButton;
