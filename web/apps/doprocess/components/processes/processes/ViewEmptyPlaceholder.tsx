import { HTMLAttributes } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';

export function ViewEmptyPlaceholder({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return (
        <Stack
            spacing={4}
            alignItems="center"
            className={cx('px-4 py-12 text-center sm:py-24 md:py-40 lg:py-60', className)}
            {...rest}>
            {children}
        </Stack>
    );
}
