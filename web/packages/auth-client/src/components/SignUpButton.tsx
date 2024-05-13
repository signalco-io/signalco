'use client';

import { type ReactNode } from 'react';
import { Button } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';
import { KnownPages } from '../../src/knownPages';

export function SignUpButton({ children }: { children: ReactNode }) {
    return (
        <Button
            href={KnownPages.Runs}
            variant="solid"
            endDecorator={<Navigate />}>
            {children}
        </Button>
    )
}
