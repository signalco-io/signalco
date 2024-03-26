import { Suspense } from 'react';
import { LoginEmailSentVerifyMessage } from './LoginEmailSentVerifyMessage';

export default function LoginEmailSentPage() {
    return (
        <Suspense>
            <LoginEmailSentVerifyMessage />
        </Suspense>
    )
}
