'use client';

import { Button } from '@signalco/ui-primitives/Button';
import { SignInButton as ClerkSignInButton } from '@clerk/nextjs';
import { KnownPages } from '../../src/knownPages';

export function SignInButton() {
    return (
        <ClerkSignInButton
            redirectUrl={KnownPages.Runs}
            mode="modal">
            <Button variant="plain">Sign in</Button>
        </ClerkSignInButton>
    );
}
