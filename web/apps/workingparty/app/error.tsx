'use client';

import { useEffect } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Container } from '@signalco/ui-primitives/Container';
import { Button } from '@signalco/ui-primitives/Button';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../src/knownPages';

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
        <Container className="flex h-full items-center" maxWidth="sm">
            <Stack spacing={4}>
                <Typography level="h1">Unexpected Error</Typography>
                <Typography level="body2">We apologize for the inconvenience. Our team is working diligently to resolve this issue. Thank you for your understanding.</Typography>
                <Row spacing={1}>
                    <Button variant="plain" onClick={() => reset()}>Try again...</Button>
                    <NavigatingButton href={KnownPages.Landing}>WorkingParty home</NavigatingButton>
                </Row>
            </Stack>
        </Container>
    )
}
