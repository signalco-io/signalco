'use client';

import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { useCurrentUser } from './useCurrentUser';

type AuthProtectedSectionProps = PropsWithChildren<{
    mode?: 'hide';
    redirectUrl?: never;
} | {
    mode: 'redirect';
    redirectUrl: string;
}>;

export function AuthProtectedSection({ children, mode = 'hide', redirectUrl }: AuthProtectedSectionProps) {
    const { data, isLoading, isPending } = useCurrentUser();

    if (mode === 'hide' && (isLoading || isPending || !data?.isLogginedIn)) {
        return null;
    }

    if (mode === 'redirect' && redirectUrl && !isLoading && !isPending && !data?.isLogginedIn) {
        redirect(redirectUrl);
    }

    return children;
}