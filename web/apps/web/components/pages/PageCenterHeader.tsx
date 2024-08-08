import React, { ComponentProps, PropsWithChildren } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';

type PageCenterHeaderProps = PropsWithChildren<{
    level?: ComponentProps<typeof Typography>['level'];
    subHeader?: string;
    secondary?: boolean;
}>;

export default function PageCenterHeader({
    children,
    level,
    subHeader,
    secondary
}: PageCenterHeaderProps) {
    return (
        <header className="py-4">
            <Stack alignItems="center" spacing={2}>
                <Typography level={level || (secondary ? 'h5' : 'h4')}>{children}</Typography>
                {subHeader && <Typography className={cx('text-center', secondary ? 'text-tertiary-foreground' : 'text-secondary-foreground')}>{subHeader}</Typography>}
            </Stack>
        </header>
    );
}
