import React, { ComponentProps } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';

type PageCenterHeaderProps = {
    level?: ComponentProps<typeof Typography>['level'];
    header: string;
    subHeader?: string;
    secondary?: boolean;
};

export default function PageCenterHeader({
    level,
    header,
    subHeader,
    secondary
}: PageCenterHeaderProps) {
    return (
        <header className="py-4">
            <Stack alignItems="center" spacing={2}>
                <Typography level={level || (secondary ? 'h5' : 'h4')}>{header}</Typography>
                {subHeader && <Typography className="text-center opacity-80">{subHeader}</Typography>}
            </Stack>
        </header>
    );
}
