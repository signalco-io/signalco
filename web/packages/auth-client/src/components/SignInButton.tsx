'use client';

import { Button } from '@signalco/ui-primitives/Button';
import { KnownPages } from '../../src/knownPages';

export function SignInButton() {
    return (
        <Button
            href={KnownPages.Runs}
            variant="plain">
            Sign in
        </Button>
    );
}
