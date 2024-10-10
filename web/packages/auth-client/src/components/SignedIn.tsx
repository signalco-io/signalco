'use client';

import { PropsWithChildren } from 'react';
import { useCurrentUser } from '../useCurrentUser';

export function SignedIn({ children }: PropsWithChildren) {
    const { data, isLoading } = useCurrentUser();
    if (isLoading || !data?.isLogginedIn) {
        return null;
    }

    return children;
}
