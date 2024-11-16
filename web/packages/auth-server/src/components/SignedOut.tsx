import { PropsWithChildren } from 'react';
import { auth as authAuth } from '../auth';

export async function SignedOut({ children, auth }: PropsWithChildren<{ auth: () => ReturnType<typeof authAuth> }>) {
    try {
        await auth();
        return null;
    } catch {
        return <>{children}</>;
    }
}