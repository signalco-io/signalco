import { type PropsWithChildren } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export function AuthProvider({ children }: PropsWithChildren) {
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    );
}
