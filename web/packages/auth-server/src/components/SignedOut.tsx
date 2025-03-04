import { PropsWithChildren, ReactElement } from 'react';
import { auth as authAuth } from '../auth';

export async function SignedOut({ children, auth }: PropsWithChildren<{ auth: () => ReturnType<typeof authAuth> }>): Promise<ReactElement | null> {
    try {
        await auth();
        return null;
    } catch {
        return <>{children}</>;
    }
}