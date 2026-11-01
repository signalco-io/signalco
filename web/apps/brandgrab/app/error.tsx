'use client';

import {Stack} from '@signalco/ui-primitives/Stack';
import {Row} from '@signalco/ui-primitives/Row';
import { Button } from '@signalco/ui-primitives/Button';

type RootErrorProps = {
    error: Error;
    reset: () => void;
};

export default function RootError({ reset }: RootErrorProps) {
    return (
        <Stack alignItems="center" justifyContent="center" style={{ minHeight: '50vh' }}>
            <Row justifyContent="center">
                <Stack spacing={2} alignItems="start">
                    <h1>Something went wrong</h1>
                    <p>We couldn’t load this page. Please try again.</p>
                    <Row spacing={1}>
                        <Button onClick={reset}>Try again</Button>
                    </Row>
                </Stack>
            </Row>
        </Stack>
    )
}
