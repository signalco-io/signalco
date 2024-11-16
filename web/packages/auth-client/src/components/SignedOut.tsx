'use client';

import { PropsWithChildren } from 'react';
import { useCurrentUser } from '../useCurrentUser';

export function SignedOut({ children }: PropsWithChildren) {
    const { data, isLoading } = useCurrentUser();
    if (!isLoading && !data?.isLogginedIn) {
        return children;
    }

    return null;
}
