'use client';

import { PropsWithChildren } from 'react';
import { SignedIn as ClerkSignedIn } from '@clerk/nextjs';

export function SignedIn({ children }: PropsWithChildren) {
    return <ClerkSignedIn>{children}</ClerkSignedIn>;
}
