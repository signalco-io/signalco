import { type ReactNode } from 'react';
import { Button } from '@signalco/ui-primitives/Button';
import { Navigate } from '@signalco/ui-icons';

export function SignUpButton({ children }: { children: ReactNode }) {
    return (
        <Button
            href={'/signup'}
            variant="solid"
            endDecorator={<Navigate />}>
            {children}
        </Button>
    )
}
