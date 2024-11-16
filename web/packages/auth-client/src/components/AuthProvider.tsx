'use client';

import { PropsWithChildren } from 'react';
import { AuthCurrentUserBase } from '../useCurrentUser';
import { AuthContext, AuthContextValue } from '../AuthContext';

export function AuthProvider<T extends AuthCurrentUserBase>({ children, ...rest }: PropsWithChildren & AuthContextValue<T>) {
    return (
        <AuthContext.Provider value={rest}>
            {children}
        </AuthContext.Provider>
    );
}