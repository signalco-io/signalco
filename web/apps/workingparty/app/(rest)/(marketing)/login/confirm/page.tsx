import { Suspense } from 'react';
import { LoginConfirmForm } from './LoginConfirmForm';

export default function LoginConfirmPage() {
    return (
        <Suspense>
            <LoginConfirmForm />
        </Suspense>
    );
}
