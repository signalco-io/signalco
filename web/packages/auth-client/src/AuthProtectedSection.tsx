'use client';

import { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from './useCurrentUser';

type AuthProtectedSectionProps = PropsWithChildren<{
    mode?: 'hide';
    redirectUrl?: never;
} | {
    mode: 'redirect';
    redirectUrl: string;
}>;

export function AuthProtectedSection({ children, mode = 'hide', redirectUrl }: AuthProtectedSectionProps) {
    const router = useRouter();
    const { data, isLoading } = useCurrentUser();

    if (mode === 'hide' && (isLoading || !data?.isLogginedIn)) {
        return null;
    }

    if (mode === 'redirect' && redirectUrl && !isLoading && !data?.isLogginedIn) {
        router.push(redirectUrl);
    }

    return children;
}