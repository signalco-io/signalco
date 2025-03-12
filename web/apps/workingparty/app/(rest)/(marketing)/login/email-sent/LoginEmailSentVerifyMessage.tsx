'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@signalco/ui-primitives/Typography';
import { LoadableStatusLabel } from '@signalco/ui/LoadableStatusLabel';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { KnownPages } from '../../../../../src/knownPages';
import { EmailInboxLink } from './EmailInboxLink';

async function isLoginConfirmed(email: string, clientToken: string) {
    const response = await fetch('/api/auth/login/confirmed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, clientToken }),
    });
    if (response.status === 202) {
        return false;
    }
    if (response.status === 200) {
        return true;
    }
    throw new Error('Email confirmation failed');
}

async function isLoginConfirmedPolling(email: string, clientToken: string, timeout = 300000) {
    let elapsed = 0;
    while (elapsed < timeout) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (await isLoginConfirmed(email, clientToken))
            return true;
        elapsed += 2000;
    }
    throw new Error('Timed out waiting for email login approval');
}

function useIsLoginConfirmed(email?: string, clientToken?: string) {
    return useQuery({
        queryKey: ['isConfirmed', email, clientToken],
        queryFn: () => isLoginConfirmedPolling(email ?? '', clientToken ?? ''),
        enabled: Boolean(email) && Boolean(clientToken),
        retry: false,
    });
}

export function LoginEmailSentVerifyMessage() {
    const router = useRouter();
    const [verifyPhrase] = useSearchParam('verifyPhrase');
    const [email] = useSearchParam('email');
    const [clientToken] = useSearchParam('clientToken');
    const { data: isConfirmed, isLoading, isPending, error } = useIsLoginConfirmed(email, clientToken);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (isConfirmed) {
            timeoutId = setTimeout(() => window.location.href = KnownPages.App, 1000);
        }
        return () => clearTimeout(timeoutId);
    }, [isConfirmed, router]);

    return (
        <>
            <Typography center level="body1" secondary className="text-balance">
                Open the link we just sent to{' '}
                <EmailInboxLink email={email} />,
                {' '}verify it matches security code displayed below and approve the login request.
            </Typography>
            <div className="rounded border">
                <Typography className="p-3 text-center font-bold">
                    {verifyPhrase}
                </Typography>
                <div className="border-t bg-muted p-3 py-2">
                    <LoadableStatusLabel
                        isLoading={isLoading || isPending}
                        error={error}
                        loadingLabel={'Waiting for approval...'}
                        successLabel={'Approved! Redirecting...'}
                    />
                </div>
            </div>
        </>
    );
}
