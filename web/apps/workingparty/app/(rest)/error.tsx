'use client';

import { useEffect } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Button } from '@signalco/ui-primitives/Button';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';

type RootErrorProps = {
    error: Error;
    reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <Stack alignItems="center" justifyContent="center" className="mt-16 min-h-fit">
            <Row justifyContent="center">
                <Stack spacing={4}>
                    <Typography level="h1">Page not found</Typography>
                    <Typography>{'Can\'t find find what you\'re looking for...'}</Typography>
                    <Row spacing={1}>
                        <Button variant="plain" onClick={() => reset()}>Try again...</Button>
                        <NavigatingButton href="/">doprocess home</NavigatingButton>
                    </Row>
                </Stack>
            </Row>
        </Stack>
    )
}
