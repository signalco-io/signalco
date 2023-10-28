import { PropsWithChildren } from 'react';
import { Stack } from '../Stack';

export function List({ spacing, children }: PropsWithChildren<{ spacing?: number }>) {
    return (
        <Stack spacing={spacing}>
            {children}
        </Stack>
    );
}
