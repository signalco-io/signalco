'use client';

import {Stack} from '@signalco/ui-primitives/Stack';
import {Row} from '@signalco/ui-primitives/Row';

type RootErrorProps = {
    error: Error;
    reset: () => void;
};

export default function RootError({ }: RootErrorProps) {
    return (
        <Stack alignItems="center" justifyContent="center" style={{ minHeight: '50vh' }}>
            <Row justifyContent="center">
                <Stack spacing={2} alignItems="start">
                    <h1>Page not found</h1>
                    <p>{'Can\'t find find what you\'re looking for...'}</p>
                    <Row spacing={1}>
                        {/* <Button onClick={() => reset()}>Try again...</Button>
                        <NavigatingButton href="/">BrandGrab home</NavigatingButton> */}
                    </Row>
                </Stack>
            </Row>
        </Stack>
    )
}
