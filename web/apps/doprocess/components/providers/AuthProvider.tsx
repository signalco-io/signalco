'use client';

import { type PropsWithChildren } from 'react';
import { AuthProvider as AuthClientAuthProvider } from '@signalco/auth-client/components';
import { DbUser } from '../../src/lib/db/schema';
import { KnownPages } from '../../src/knownPages';

async function currentUserFactory() {
    const response = await fetch('/api/users/current');
    if (response.status < 200 || response.status > 299) {
        return null;
    }

    return await response.json() as DbUser;
}

export function AuthProvider({ children }: PropsWithChildren) {
    return (
        <AuthClientAuthProvider currentUserFactory={currentUserFactory}
            urls={{
                signIn: KnownPages.Login,
                signOut: KnownPages.Logout,
                signUp: KnownPages.Login
            }}>
            {children}
        </AuthClientAuthProvider>
    );
}
