'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { useSearchParam } from '@signalco/hooks/useSearchParam';

export function LoginEmailSentVerifyMessage() {
    const [verifyPhrase] = useSearchParam('verifyPhrase');
    const [email] = useSearchParam('email');

    return (
        <>
            <Typography center level="h2" semiBold>Email Login</Typography>
            <Typography center level="body1" secondary>
                Open the link we just sent to{' '}
                <span className="inline font-semibold text-blue-500">{email}</span>,
                {' '}verify it matches security code displayed below.
            </Typography>
            <Stack spacing={1}>
                <Typography className="rounded border p-3 text-center font-bold">
                    {verifyPhrase}
                </Typography>
                <Typography center level="body2" tertiary>
                    You can close this window after you have successfully logged in.
                </Typography>
            </Stack>
        </>
    );
}
