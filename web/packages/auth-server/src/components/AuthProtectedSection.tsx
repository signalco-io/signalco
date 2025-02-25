import { PropsWithChildren, ReactElement } from 'react';
import { redirect } from 'next/navigation';
import { auth as authAuth } from '../auth';

type AuthProtectedSectionProps = PropsWithChildren<{
    auth: () => ReturnType<typeof authAuth>;
}
    & ({
        mode?: 'hide';
        redirectUrl?: never;
    } | {
        mode: 'redirect';
        redirectUrl: string;
    })>;

export async function AuthProtectedSection({ children, auth, mode = 'hide', redirectUrl }: AuthProtectedSectionProps): Promise<ReactElement | null> {
    try {
        await auth();
        return <>{children}</>;
    } catch {
        if (mode === 'redirect' && redirectUrl) {
            redirect(redirectUrl);
        } else {
            return null;
        }
    }
}