'use client';

import { type ReactNode } from 'react';
import { Button } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';
import { SignUpButton as ClerkSignUpButton } from '@clerk/nextjs';
import { KnownPages } from '../../src/knownPages';

export function SignUpButton({ children }: { children: ReactNode }) {
    return (
        <ClerkSignUpButton
            redirectUrl={KnownPages.Runs}
            mode="modal">
            <Button
                variant="solid"
                endDecorator={<Navigate />}>
                {children}
            </Button>
        </ClerkSignUpButton>
    )
}
