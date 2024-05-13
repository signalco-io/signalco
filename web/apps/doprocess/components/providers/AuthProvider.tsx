import { type PropsWithChildren } from 'react';

export function AuthProvider({ children }: PropsWithChildren) {
    console.warn('AuthProvider is not implemented.');
    return (
        <>
            {children}
        </>
    );
}
