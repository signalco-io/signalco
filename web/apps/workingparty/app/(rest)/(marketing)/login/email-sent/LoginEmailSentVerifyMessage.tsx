'use client';
import { Typography } from '@signalco/ui-primitives/Typography';
import { useSearchParam } from '@signalco/hooks/useSearchParam';

export function LoginEmailSentVerifyMessage() {
    const [verifyPhrase] = useSearchParam('verifyPhrase');
    const [email] = useSearchParam('email');

    return (
        <>
            <Typography center level="h2" semiBold>Email Login</Typography>
            <Typography center level="body1" secondary>
                Keep this window open, and in new tab or another device, open the link we just sent to{' '}
                <span className="inline font-semibold text-blue-500">{email}</span>{' '}
                with security code:
            </Typography>
            <Typography className="rounded border p-3 text-center font-bold">
                {verifyPhrase}
            </Typography>
        </>
    );
}
