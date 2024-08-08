import { Suspense } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { LoginEmailSentVerifyMessage } from './LoginEmailSentVerifyMessage';

export default function LoginEmailSentPage() {
    return (
        <>
            <Typography center level="h2" semiBold>Email Login</Typography>
            <Suspense fallback="Loading...">
                <LoginEmailSentVerifyMessage />
            </Suspense>
            <Typography center level="body2" tertiary>
                Do not close this page until you have approved the login. You will be redirected to the app automatically.
            </Typography>
        </>
    )
}
