'use client';

import React from 'react';
import Link from 'next/link';
import { Stack, Button, Typography } from '@signalco/ui';

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
