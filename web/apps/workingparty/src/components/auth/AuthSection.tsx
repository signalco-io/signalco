'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KnownPages } from '../../knownPages';
import { useCurrentUser } from '../../hooks/data/users/useCurrentUser';

export function AuthSection({ children }: PropsWithChildren) {
    const router = useRouter();
    const { data, isLoading } = useCurrentUser();

    useEffect(() => {
        if (!isLoading && !data?.isLogginedIn)
            router.push(KnownPages.Login);
    }, [data?.isLogginedIn, isLoading, router]);

    return children;
}