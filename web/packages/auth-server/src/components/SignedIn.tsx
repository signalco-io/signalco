import { PropsWithChildren } from 'react';
import { auth as authAuth } from '../auth';

export async function SignedIn({ children, auth }: PropsWithChildren<{ auth: () => ReturnType<typeof authAuth> }>) {
    try {
        await auth();
    } catch {
        return null;
    }

    return <>{children}</>;
}