import React from 'react';
import Link from 'next/link';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Button } from '@signalco/ui-primitives/Button';

export function FeatureDescription(props: { header: string; content: string | React.ReactElement; link?: string; linkText?: string; }) {
    return (
        <Stack spacing={2}>
            <Typography level="h5" component="h3">{props.header}</Typography>
            <Typography color="neutral">{props.content}</Typography>
            <div>
                {props.link && (
                    <Link passHref href={props.link}>
                        <Button variant="outlined">{props.linkText ?? 'Read more'}</Button>
                    </Link>
                )}
            </div>
        </Stack>
    );
}
