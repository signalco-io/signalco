'use client';

import { PropsWithChildren } from 'react';
import { SignedOut as ClerkSignedOut } from '@clerk/nextjs';

export function SignedOut({ children }: PropsWithChildren) {
    return <ClerkSignedOut>{children}</ClerkSignedOut>;
}
