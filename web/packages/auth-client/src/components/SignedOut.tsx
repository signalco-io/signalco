'use client';

import { PropsWithChildren } from 'react';
import { useCurrentUser } from '../useCurrentUser';

export function SignedOut({ children }: PropsWithChildren) {
    const { data } = useCurrentUser();
    if (!data?.isLogginedIn) {
        return children;
    }

    return null;
}
