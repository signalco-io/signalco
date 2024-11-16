'use client';

import { PropsWithChildren } from 'react';
import { AuthProvider } from '@signalco/auth-client/components';

export type User = {
    id: string;
    displayName: string;
    email: string;
    createdAt: number;
    accountIds: Array<string>;
};

async function currentUserFactory() {
    const response = await fetch('/api/users/current');
    if (response.status < 200 || response.status > 299) {
        return null;
    }

    return await response.json() as User;
}

export function AuthAppProvider({ children }: PropsWithChildren) {
    return (
        <AuthProvider currentUserFactory={currentUserFactory}>
            {children}
        </AuthProvider>
    );
}