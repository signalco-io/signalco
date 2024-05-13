'use client';

import { PropsWithChildren } from 'react';
import { useCurrentUser } from '../useCurrentUser';

export function SignedIn({ children }: PropsWithChildren) {
    const { data } = useCurrentUser();
    if (!data?.isLogginedIn) {
        return null;
    }

    return children;
}
