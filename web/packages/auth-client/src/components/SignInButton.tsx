'use client';

import { useContext } from 'react';
import { Button, ButtonProps } from '@signalco/ui-primitives/Button';
import { AuthContext } from '../AuthContext';

export function SignInButton({ variant, children, ...props }: Omit<ButtonProps, 'href'>) {
    const authContext = useContext(AuthContext);
    return (
        <Button
            href={authContext.urls?.signIn ?? '/signin'}
            variant={variant ?? 'plain'}
            {...props}>
            {children ?? 'Sign In'}
        </Button>
    );
}
