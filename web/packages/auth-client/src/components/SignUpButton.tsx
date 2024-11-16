'use client';

import { useContext } from 'react';
import { Button, ButtonProps } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';
import { AuthContext } from '../AuthContext';

export function SignUpButton({ variant, endDecorator, ...props }: Omit<ButtonProps, 'href'>) {
    const authContext = useContext(AuthContext);
    return (
        <Button
            href={authContext.urls?.signUp ?? '/signup'}
            variant={variant ?? 'solid'}
            endDecorator={endDecorator ?? <Navigate />}
            {...props} />
    )
}
